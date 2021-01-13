import got from 'got';
import { NetvisorAccountingMethods } from './methods/accounting';
import { NetvisorPaymentMethods } from './methods/payments';
import { NetvisorSalesMethods } from './methods/sales';
import { NetvisorBudgetMethods } from './methods/budget';
import moment from 'moment';
import crypto from 'crypto';
import path from 'path';
import * as xml2js from 'xml2js';

export interface INetvisorApiClientOptions {
  /** Integration name, sent as `X-Netvisor-Authentication-Sender` in requests */
  integrationName: string;
  customerId: string;
  customerKey: string;
  partnerId: string;
  partnerKey: string;
  organizationId: string;

  language?: string;
  baseUri?: string;
}

export interface INetvisorRequestHeaders {
  [key: string]: any;

  'X-Netvisor-Authentication-Sender': string;
  'X-Netvisor-Authentication-CustomerId': string;
  'X-Netvisor-Authentication-PartnerId' : string;
  'X-Netvisor-Authentication-Timestamp' : string;
  'X-Netvisor-Authentication-TransactionId' : string;
  'X-Netvisor-Interface-Language' : string | undefined;
  'X-Netvisor-Organisation-ID' : string;
  'X-Netvisor-Authentication-MAC'? : string;
  'X-Netvisor-Authentication-MACHashCalculationAlgorithm' : string;
  'Content-Type'? : string;
}


export class NetvisorApiClient {
  options: INetvisorApiClientOptions;

  readonly accounting: NetvisorAccountingMethods;
  readonly payments: NetvisorPaymentMethods;
  readonly sales: NetvisorSalesMethods;
  readonly budget: NetvisorBudgetMethods;

  constructor(options: INetvisorApiClientOptions) {
    // Set default connect URI
    options.baseUri = options.baseUri || 'https://integration.netvisor.fi';

    // Set default language FI
    options.language = options.language || 'FI';

    if ( ! options.integrationName) {
      throw new Error('Missing options.integrationName');
    }

    if ( ! options.customerId) {
      throw new Error('Missing options.customerId');
    }

    if ( ! options.partnerId) {
      throw new Error('Missing options.partnerId');
    }

    if ( ! options.customerKey) {
      throw new Error('Missing options.customerKey');
    }

    if ( ! options.partnerKey) {
      throw new Error('Missing options.partnerKey');
    }

    if ( ! options.organizationId) {
      throw new Error('Missing options.organizationId');
    }

    this.accounting = new NetvisorAccountingMethods(this);

    this.payments = new NetvisorPaymentMethods(this);

    this.sales = new NetvisorSalesMethods(this);

    this.budget = new NetvisorBudgetMethods(this);

    this.options = options;
  }

  _generateHeaderMAC(url: string, headers: INetvisorRequestHeaders) : string {
    return crypto.createHash('sha256')
      .update(`${url}&${headers['X-Netvisor-Authentication-Sender']}&${headers['X-Netvisor-Authentication-CustomerId']}&${headers['X-Netvisor-Authentication-Timestamp']}&${headers['X-Netvisor-Interface-Language']}&${headers['X-Netvisor-Organisation-ID']}&${headers['X-Netvisor-Authentication-TransactionId']}&${this.options.customerKey}&${this.options.partnerKey}`)
      .digest('hex');
  }

  _generateHeaders(url: string) : INetvisorRequestHeaders {
    const headers : INetvisorRequestHeaders = {
      'X-Netvisor-Authentication-Sender' : this.options.integrationName,
      'X-Netvisor-Authentication-CustomerId' : this.options.customerId,
      'X-Netvisor-Authentication-PartnerId' : this.options.partnerId,
      'X-Netvisor-Authentication-Timestamp' : moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      'X-Netvisor-Authentication-TransactionId' : crypto.randomBytes(32).toString('hex').substring(0,16),
      'X-Netvisor-Interface-Language' : this.options.language,
      'X-Netvisor-Organisation-ID' : this.options.organizationId,
      'X-Netvisor-Authentication-MACHashCalculationAlgorithm' : 'SHA256',
      'Content-Type' : 'text/xml'
    }
  

    headers['X-Netvisor-Authentication-MAC'] = this._generateHeaderMAC(url, headers);
  
    return headers;
  }

  _generateUrl(endpointUri: string) : string {
    return new URL(endpointUri, this.options.baseUri).href;
  }

  async post(endpointUri: string, body: string) {
    const url = this._generateUrl(endpointUri);
    const headers = this._generateHeaders(url);

    const request : any = await got.post(url, {
      body,
      headers
    });

    console.log(request.body);

    const result: any = await this._checkRequestStatus(request.body);

    return result;
  }

  async get(endpointUri: string) {
    const url = this._generateUrl(endpointUri);
    const headers = this._generateHeaders(url);

    const request : any = await got.get(url, {
      headers
    });

    console.log(request);

    //const result: any = await this._checkRequestStatus(request.body);

    return request;
  }

  _checkRequestStatus(request: any) {
    const xmlParser = new xml2js.Parser();

    return new Promise(async (resolve, reject) => {
      xmlParser.parseString(request, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status
        resolve(status);
      });
    });
    
  }
}
