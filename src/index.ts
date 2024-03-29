import got from 'got';
import crypto from 'crypto';
import * as xml2js from 'xml2js';
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

const cacheableLookup = new CacheableLookup();

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

  dnsCache?: CacheableLookup | boolean;
}

export interface NetvisorRequestHeaders {
  [key: string]: any;

  'X-Netvisor-Authentication-Sender': string;
  'X-Netvisor-Authentication-CustomerId': string;
  'X-Netvisor-Authentication-PartnerId': string;
  'X-Netvisor-Authentication-Timestamp': string;
  'X-Netvisor-Authentication-TransactionId': string;
  'X-Netvisor-Interface-Language': string | undefined;
  'X-Netvisor-Organisation-ID': string;
  'X-Netvisor-Authentication-MAC'?: string;
  'X-Netvisor-Authentication-MACHashCalculationAlgorithm': string;
  'Content-Type'?: string;
}

export class NetvisorApiClient {
  [propName: string]: any;
  options: NetvisorApiClientOptions;

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

    // If dnsCache is true, then fallback to internal instance of cacheableLookup
    if (this.options.dnsCache === true) {
      this.options.dnsCache = cacheableLookup;
    }
  }

  _generateHeaderMAC(url: string, headers: NetvisorRequestHeaders): string {
    return crypto
      .createHash('sha256')
      .update(
        `${url}&${headers['X-Netvisor-Authentication-Sender']}&${headers['X-Netvisor-Authentication-CustomerId']}&${headers['X-Netvisor-Authentication-Timestamp']}&${headers['X-Netvisor-Interface-Language']}&${headers['X-Netvisor-Organisation-ID']}&${headers['X-Netvisor-Authentication-TransactionId']}&${this.options.customerKey}&${this.options.partnerKey}`,
        'latin1'
      )
      .digest('hex');
  }

  _generateHeaders(url: string): NetvisorRequestHeaders {
    const headers: NetvisorRequestHeaders = {
      'X-Netvisor-Authentication-Sender': this.options.integrationName,
      'X-Netvisor-Authentication-CustomerId': this.options.customerId,
      'X-Netvisor-Authentication-PartnerId': this.options.partnerId,
      'X-Netvisor-Authentication-Timestamp': new Date().toISOString().replace('T', ' ').replace('Z', ''),
      'X-Netvisor-Authentication-TransactionId': Date.now().toString() + crypto.randomBytes(32).toString('hex').substring(0, 16),
      'X-Netvisor-Interface-Language': this.options.language,
      'X-Netvisor-Organisation-ID': this.options.organizationId,
      'X-Netvisor-Authentication-MACHashCalculationAlgorithm': 'SHA256',
      'Content-Type': 'text/xml'
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

    const request: any = await got.post(url, {
      body,
      headers,
      timeout: {
        request: this.options.timeout
      },

      agent: { https: this.keepAliveAgent },
      dnsCache: this.options.dnsCache || undefined
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

    const request: any = await got(url, {
      headers,
      timeout: {
        request: this.options.timeout
      },
      agent: { https: this.keepAliveAgent },
      dnsCache: this.options.dnsCache || undefined
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
          reject(status[1]);
        }
      });
    });
  }
}
