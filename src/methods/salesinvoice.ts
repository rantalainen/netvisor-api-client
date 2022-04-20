import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as xml2js from 'xml2js';
import * as js2xmlparser from 'js2xmlparser';

export interface ISalesInvoice {
  salesInvoice: {
    salesInvoiceNumber?: number;
    salesInvoiceDate: { '@': { format: string }; '#': string };
    salesInvoiceEventDate?: { '@': { format: string }; '#': string };
    salesInvoiceDueDate?: { '@': { format: string }; '#': string };
    salesInvoiceReferenceNumber?: string;
    salesInvoiceAmount?: string | { '@': { iso4217currencycode: string }; '#': string };
    invoiceType: string;
    salesInvoiceStatus: { '@': { type: string }; '#': string };
    invoicingCustomeridentifier: { '@': { type: string }; '#': string };
    invoicingCustomerName: string;
    invoicingCustomerAddressLine: string;
    invoicingCustomerPostNumber: string;
    invoicingCustomerTown: string;
    invoicingCustomerCountryCode: { '@': { type: string }; '#': string };
    invoiceLines: {
      invoiceLine: Array<ISalesInvoiceProductLine>;
    };
    [key: string]: any;
  };
}

export interface ISalesInvoiceProductLine {
  salesInvoiceProductLine?: {
    productIdentifier: { '@': { type: string }; '#': string };
    productName?: string;
    productunitPrice?: { '@': { type: string }; '#': number | string };
    productVatPercentage?: { '@': { vatcode: string }; '#': number | string };
    salesInvoiceProductLineQuantity?: number | string;
    [key: string]: any;
  };
  salesinvoicecommentline?: {
    comment: string;
  };
}

export class NetvisorSalesMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'salesinvoice.nv';
  }

  /**
   * Save one invoice as a invoice object
   * @param dataset as ISalesInvoice
   */
  async saveInvoiceByDataSet(dataset: ISalesInvoice) {
    const xml = js2xmlparser.parse('Root', dataset);

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''));
  }

  /**
   * Fetch sales or orders with invoicelines
   * @param params use { listtype: '' } for invoices
   * and { listtype: 'preinvoice' } for orders
   */
  async getSales(params: any) {
    const salesRaw = await this._client.get('salesinvoicelist.nv', params);

    var parser = new xml2js.Parser();

    const salesList: Array<any> = await new Promise(async (resolve, reject) => {
      parser.parseString(salesRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json: any = xmlResult.Root.SalesInvoiceList[0].SalesInvoice;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    // salesList returns undefined if no sales in search criteria
    if (!salesList) {
      return [];
    }

    const salesInvoiceKeys = [];
    for (const item of salesList) {
      salesInvoiceKeys.push(item.NetvisorKey[0]);
    }

    const resource = params.listtype == 'preinvoice' ? 'getorder.nv' : 'getsalesinvoice.nv';

    const salesInvoicesRaw = await this._client.get(resource, { netvisorkeylist: salesInvoiceKeys.join(',') });

    var parser = new xml2js.Parser();

    const salesInvoices: Array<any> = await new Promise(async (resolve, reject) => {
      parser.parseString(salesInvoicesRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json = salesInvoiceKeys.length > 1 ? xmlResult.Root.SalesInvoices[0].SalesInvoice : xmlResult.Root.SalesInvoice;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    const salesInvoiceList = [];
    for (const item of salesInvoices) {
      const invoiceRows = !item.InvoiceLines ? [] : item.InvoiceLines[0].InvoiceLine[0].SalesInvoiceProductLine;

      for (const row of invoiceRows) {
        for (const [key, value] of Object.entries(row)) {
          if (Array.isArray(value)) {
            row[key] = value[0];
          }
        }
      }

      let currency = 'EUR';
      let currencyRate = '1';
      if (!!item.SalesInvoiceAmount[0].$) {
        currency = item.SalesInvoiceAmount[0].$.iso4217currencycode;
        currencyRate = item.SalesInvoiceAmount[0].$.currencyrate;
      }

      const invoice = {
        netvisorKey: item.SalesInvoiceNetvisorKey[0],
        salesInvoiceNumber: item.SalesInvoiceNumber[0],
        invoiceDate: item.SalesInvoiceDate[0],
        invoiceAmount: item.SalesInvoiceAmount[0],
        currency: currency,
        currencyRate: currencyRate,
        seller: item.SellerIdentifier[0],
        invoiceStatus: item.InvoiceStatus[0],
        customerKey: item.InvoicingCustomerNetvisorKey[0],
        customerName: item.InvoicingCustomerName[0],
        customerAddress: item.InvoicingCustomerAddressline[0],
        customerPostnumber: item.InvoicingCustomerPostnumber[0],
        customerTown: item.InvoicingCustomerTown[0],
        customerCountry: item.InvoicingCustomerCountryCode[0],
        deliveryCountry: item.DeliveryAddressCountryCode[0],
        invoiceLines: invoiceRows
      };
      salesInvoiceList.push(invoice);
    }

    return salesInvoiceList;
  }
}
