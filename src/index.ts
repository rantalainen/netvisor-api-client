import got, { Got } from 'got';
import crypto from 'crypto';
import * as xml2js from 'xml2js';
import { Agent } from 'https';
import CacheableLookup from 'cacheable-lookup';
import { NetvisorCustomerMethod } from './methods/customers';
import { NetvisorPaymentMethod } from './methods/payments';
import { NetvisorSalesMethod } from './methods/salesinvoices';
import { NetvisorDimensionMethod } from './methods/dimensions';
import { NetvisorAccountingMethod } from './methods/accounting';
import { NetvisorProductsMethod } from './methods/products';
import { NetvisorPurchasesMethod } from './methods/purchases';
import { NetvisorPayrollMethod } from './methods/payroll';
import { NetvisorWorkdayMethod } from './methods/workday';
import { HttpsAgent } from 'agentkeepalive';

export interface NetvisorApiClientOptions {
  /** Integration name, sent as `X-Netvisor-Authentication-Sender` in requests */
  integrationName: string;
  customerId: string;
  customerKey: string;
  partnerId: string;
  partnerKey: string;
  organizationId: string;

  language?: string;
  baseUri?: string;

  /** Request timeout in milliseconds, defaults to 120000 (120 secs) */
  timeout?: number;

  /** Instance of `cacheable-lookup` or `true` to enable internal DNS cache, defaults to `undefined` (no caching) */
  dnsCache?: CacheableLookup | boolean;

  /** Instance of `https.Agent` or `true` to enable internal Keep Alive Agent, defaults to `true` */
  keepAliveAgent?: boolean | Agent;
}

export interface NetvisorRequestHeaders {
  [key: string]: any;

  'X-Netvisor-Authentication-Sender': string;
  'X-Netvisor-Authentication-CustomerId': string;
  'X-Netvisor-Authentication-PartnerId': string;
  'X-Netvisor-Authentication-Timestamp': string;
  'X-Netvisor-Authentication-TimestampUnix': string | number;
  'X-Netvisor-Authentication-TransactionId': string;
  'X-Netvisor-Interface-Language'?: string;
  'X-Netvisor-Organisation-ID': string;
  'X-Netvisor-Authentication-UseHTTPResponseStatusCodes'?: '1';
  'X-Netvisor-Authentication-MAC'?: string;
  'X-Netvisor-Authentication-MACHashCalculationAlgorithm': string;
  'Content-Type'?: string;
}

// Create global https agent
const httpsAgent = new HttpsAgent();

export class NetvisorApiClient {
  options: NetvisorApiClientOptions;

  /** Got instance to be used when making requests */
  gotInstance: Got;

  readonly customers: NetvisorCustomerMethod;
  readonly payments: NetvisorPaymentMethod;
  readonly sales: NetvisorSalesMethod;
  readonly dimensions: NetvisorDimensionMethod;
  readonly accounting: NetvisorAccountingMethod;
  readonly products: NetvisorProductsMethod;
  readonly purchases: NetvisorPurchasesMethod;
  readonly payroll: NetvisorPayrollMethod;
  readonly workday: NetvisorWorkdayMethod;

  constructor(options: NetvisorApiClientOptions) {
    // Set default connect URI
    options.baseUri = options.baseUri || 'https://integration.netvisor.fi/';
    if (!options.baseUri.endsWith('/')) options.baseUri += '/';

    // Set default timeout
    options.timeout = options.timeout || 120000;

    // Set default language FI
    options.language = options.language || 'FI';

    if (!options.integrationName) throw new Error('Missing options.integrationName');
    if (!options.customerId) throw new Error('Missing options.customerId');
    if (!options.partnerId) throw new Error('Missing options.partnerId');
    if (!options.customerKey) throw new Error('Missing options.customerKey');
    if (!options.partnerKey) throw new Error('Missing options.partnerKey');
    if (!options.organizationId) throw new Error('Missing options.organizationId');

    this.customers = new NetvisorCustomerMethod(this);
    this.payments = new NetvisorPaymentMethod(this);
    this.sales = new NetvisorSalesMethod(this);
    this.dimensions = new NetvisorDimensionMethod(this);
    this.accounting = new NetvisorAccountingMethod(this);
    this.products = new NetvisorProductsMethod(this);
    this.purchases = new NetvisorPurchasesMethod(this);
    this.payroll = new NetvisorPayrollMethod(this);
    this.workday = new NetvisorWorkdayMethod(this);

    this.options = options;

    // Use internal keepAliveAgent by default
    if (this.options.keepAliveAgent === true || this.options.keepAliveAgent === undefined) {
      this.options.keepAliveAgent = httpsAgent;
    }

    // Set gotInstance defaults, can also include other options
    this.gotInstance = got.extend({
      // Agent options
      agent: { https: this.options.keepAliveAgent || undefined },

      // DNS caching options
      dnsCache: this.options.dnsCache || undefined,

      // Timeout
      timeout: this.options.timeout
    });
  }

  _generateHeaderMAC(url: string, headers: NetvisorRequestHeaders): string {
    const key = this.options.customerKey + '&' + this.options.partnerKey;
    const message = [
      url,
      headers['X-Netvisor-Authentication-Sender'],
      headers['X-Netvisor-Authentication-CustomerId'],
      headers['X-Netvisor-Authentication-Timestamp'],
      headers['X-Netvisor-Interface-Language'],
      headers['X-Netvisor-Organisation-ID'],
      headers['X-Netvisor-Authentication-TransactionId'],
      headers['X-Netvisor-Authentication-TimestampUnix'],
      this.options.customerKey,
      this.options.partnerKey
    ].join('&');

    return crypto.createHmac('sha256', Buffer.from(key, 'latin1')).update(Buffer.from(message, 'latin1')).digest('hex');
  }

  _generateHeaders(url: string): NetvisorRequestHeaders {
    const headers: NetvisorRequestHeaders = {
      'Content-Type': 'text/plain',
      'X-Netvisor-Authentication-Sender': this.options.integrationName,
      'X-Netvisor-Authentication-CustomerId': this.options.customerId,
      'X-Netvisor-Authentication-PartnerId': this.options.partnerId,
      'X-Netvisor-Authentication-Timestamp': new Date().toISOString().replace('T', ' ').replace('Z', ''),
      'X-Netvisor-Authentication-TimestampUnix': Math.floor(Date.now() / 1000).toString(),
      'X-Netvisor-Authentication-TransactionId': Date.now().toString() + crypto.randomBytes(32).toString('hex').substring(0, 16),
      'X-Netvisor-Interface-Language': this.options.language,
      'X-Netvisor-Organisation-ID': this.options.organizationId,
      'X-Netvisor-Authentication-UseHTTPResponseStatusCodes': '1',
      'X-Netvisor-Authentication-MACHashCalculationAlgorithm': 'HMACSHA256'
    };

    headers['X-Netvisor-Authentication-MAC'] = this._generateHeaderMAC(url, headers);

    return headers;
  }

  _generateUrl(endpointUri: string, searchParams: any): string {
    if (searchParams) {
      const queryString = Object.keys(searchParams)
        .map((key) => key + '=' + searchParams[key])
        .join('&');
      return this.options.baseUri + endpointUri + '?' + queryString;
    } else {
      return this.options.baseUri + endpointUri;
    }
  }

  async post(endpointUri: string, body: string | undefined, params?: any): Promise<string> {
    // Create url with search parameters included
    const url = this._generateUrl(endpointUri, params);

    const headers = this._generateHeaders(url);

    const request: any = await this.gotInstance.post(url, {
      body,
      headers,
      // Don't throw on 4xx/5xx status codes, handle errors based on Netvisor response XML
      throwHttpErrors: false
    });

    try {
      await this._checkRequestStatus(request.body);

      return request.body;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async get(endpointUri: string, params?: any): Promise<string> {
    // Create url with search parameters included
    const url = this._generateUrl(endpointUri, params);

    const headers = this._generateHeaders(url);

    const request: any = await this.gotInstance(url, {
      headers,
      // Don't throw on 4xx/5xx status codes, handle errors based on Netvisor response XML
      throwHttpErrors: false
    });

    try {
      await this._checkRequestStatus(request.body);

      return request.body;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  _checkRequestStatus(request: any): Promise<any> {
    const xmlParser = new xml2js.Parser();

    return new Promise(async (resolve, reject) => {
      xmlParser.parseString(request, (error, xmlResult) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;

        if (status[0] === 'OK') {
          resolve(true);
        } else {
          // Create a proper error with the Netvisor error details
          const errorMessage = status[1];
          const error = new Error(errorMessage);
          error.name = 'NetvisorError';

          reject(error);
        }
      });
    });
  }
}
