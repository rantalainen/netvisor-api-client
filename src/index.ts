import got, { Got, GotReturn } from 'got';
import { NetvisorCustomerMethod } from './methods/customers';
import { NetvisorPaymentMethod } from './methods/payments';
import { NetvisorSalesMethod } from './methods/salesinvoices';
import { NetvisorDimensionMethod } from './methods/dimensions';
import moment from 'moment';
import crypto from 'crypto';
import * as xml2js from 'xml2js';
import CacheableLookup from 'cacheable-lookup';

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

  constructor(options: NetvisorApiClientOptions) {
    // Set default connect URI
    options.baseUri = options.baseUri || 'https://integration.netvisor.fi';

    // Set default timeout
    options.timeout = options.timeout || 120000;

    // Set default language FI
    options.language = options.language || 'FI';

    if (!options.integrationName) {
      throw new Error('Missing options.integrationName');
    }

    if (!options.customerId) {
      throw new Error('Missing options.customerId');
    }

    if (!options.partnerId) {
      throw new Error('Missing options.partnerId');
    }

    if (!options.customerKey) {
      throw new Error('Missing options.customerKey');
    }

    if (!options.partnerKey) {
      throw new Error('Missing options.partnerKey');
    }

    if (!options.organizationId) {
      throw new Error('Missing options.organizationId');
    }

    this.customers = new NetvisorCustomerMethod(this);
    this.payments = new NetvisorPaymentMethod(this);
    this.sales = new NetvisorSalesMethod(this);
    this.dimensions = new NetvisorDimensionMethod(this);

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
        `${url}&${headers['X-Netvisor-Authentication-Sender']}&${headers['X-Netvisor-Authentication-CustomerId']}&${headers['X-Netvisor-Authentication-Timestamp']}&${headers['X-Netvisor-Interface-Language']}&${headers['X-Netvisor-Organisation-ID']}&${headers['X-Netvisor-Authentication-TransactionId']}&${this.options.customerKey}&${this.options.partnerKey}`
      )
      .digest('hex');
  }

  _generateHeaders(url: string, params?: any): NetvisorRequestHeaders {
    const headers: NetvisorRequestHeaders = {
      'X-Netvisor-Authentication-Sender': this.options.integrationName,
      'X-Netvisor-Authentication-CustomerId': this.options.customerId,
      'X-Netvisor-Authentication-PartnerId': this.options.partnerId,
      'X-Netvisor-Authentication-Timestamp': moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      'X-Netvisor-Authentication-TransactionId': crypto.randomBytes(32).toString('hex').substring(0, 16),
      'X-Netvisor-Interface-Language': this.options.language,
      'X-Netvisor-Organisation-ID': this.options.organizationId,
      'X-Netvisor-Authentication-MACHashCalculationAlgorithm': 'SHA256',
      'Content-Type': 'text/xml'
    };

    if (params) {
      const queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
      url = `${url}?${queryString}`;
    }

    headers['X-Netvisor-Authentication-MAC'] = this._generateHeaderMAC(url, headers);

    return headers;
  }

  _generateUrl(endpointUri: string): string {
    return new URL(endpointUri, this.options.baseUri).href;
  }

  async post(endpointUri: string, body: string, params?: any): Promise<string> {
    const url = this._generateUrl(endpointUri);

    const headers = this._generateHeaders(url, params);

    const request: any = await got.post(url, {
      body,
      headers,
      searchParams: params,
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
    const url = this._generateUrl(endpointUri);

    const headers = this._generateHeaders(url, params);

    const request: any = await got(url, {
      headers,
      searchParams: params,
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
