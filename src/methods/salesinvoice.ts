import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as xml2js from 'xml2js';
import * as js2xmlparser from 'js2xmlparser';

export interface ISalesPayment {
  salespayment: {
    sum: { '@': { currency: string }; '#': string };
    paymentdate: string;
    targetidentifier: { '@': { type: string; targettype: string }; '#': string };
    sourcename: string;
    paymentmethod: { '@': { type: string }; '#': string };
    salespaymentvoucherlines?: { voucherline: IVoucherLine[] };
  };
}

export interface IVoucherLine {
  linesum: { '@': { type: string }; '#': string };
  description?: string;
  accountnumber: string;
  vatpercent: { '@': { vatcode: string }; '#': number | string };
  dimension?: IDimension[];
}

interface IDimension {
  dimensionname: string;
  dimensionitem: string;
}

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
    invoicingCustomerName?: string;
    invoicingCustomerAddressLine?: string;
    invoicingCustomerPostNumber?: string;
    invoicingCustomerTown?: string;
    invoicingCustomerCountryCode?: { '@': { type: string }; '#': string };
    invoiceLines: {
      invoiceLine: Array<ISalesInvoiceProductLine>;
    };
    [key: string]: any;
  };
}

export interface ISalesInvoiceProductLine {
  salesInvoiceProductLine?: {
    productIdentifier: { '@': { type: string }; '#': string };
    productName: string;
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

    // If salesList contains more than 100 -> must split salesinvoices fetch
    const limit = 100;
    let offset = 0;
    const salesInvoices = [];

    const resource = params.listtype == 'preinvoice' ? 'getorder.nv' : 'getsalesinvoice.nv';

    do {
      const newArr = salesInvoiceKeys.slice(offset, limit + offset);
      params['netvisorkeylist'] = newArr.join(',');

      const salesInvoicesRaw = await this._client.get(resource, params);

      var parser = new xml2js.Parser();

      const salesInvoicesPart: Array<any> = await new Promise(async (resolve, reject) => {
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

      salesInvoices.push(...salesInvoicesPart);

      offset = offset + limit;
    } while (offset < salesInvoiceKeys.length);

    // Format invoicedata as simple JSON
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

      const invoice: any = {
        netvisorKey: item.SalesInvoiceNetvisorKey[0],
        salesInvoiceNumber: item.SalesInvoiceNumber[0],
        invoiceDate: item.SalesInvoiceDate[0],
        invoiceEventDate: item.SalesInvoiceEventDate[0],
        invoiceValueDate: item.SalesInvoiceValueDate[0],
        invoiceDeliveryDate: item.SalesInvoiceDeliveryDate[0],
        invoiceDueDate: item.SalesInvoiceDueDate[0],
        invoiceReferencenumber: item.SalesInvoiceReferencenumber[0],
        invoiceAmount: item.SalesInvoiceAmount[0],
        currency: currency,
        currencyRate: currencyRate,
        seller: item.SellerIdentifier[0],
        invoiceStatus: item.InvoiceStatus[0],
        salesInvoiceFreeTextBeforeLines: item.SalesInvoiceFreeTextBeforeLines[0],
        salesInvoiceFreeTextAfterLines: item.SalesInvoiceFreeTextAfterLines[0],
        salesInvoiceOurReference: item.SalesInvoiceOurReference[0],
        salesInvoiceYourReference: item.SalesInvoiceYourReference[0],
        salesInvoicePrivateComment: item.SalesInvoicePrivateComment[0],
        salesInvoiceAgreementIdentifier: item.SalesInvoiceAgreementIdentifier[0],
        customerKey: item.InvoicingCustomerNetvisorKey[0],
        customerName: item.InvoicingCustomerName[0],
        customerAddress: item.InvoicingCustomerAddressline[0],
        customerPostnumber: item.InvoicingCustomerPostnumber[0],
        customerTown: item.InvoicingCustomerTown[0],
        customerCountry: item.InvoicingCustomerCountryCode[0],
        deliveryAddressName: item.DeliveryAddressName[0],
        deliveryAddressLine: item.DeliveryAddressLine[0],
        deliveryAddressPostnumber: item.DeliveryAddressPostnumber[0],
        deliveryAddressTown: item.DeliveryAddressTown[0],
        deliveryCountry: item.DeliveryAddressCountryCode[0],
        invoiceLines: invoiceRows
      };

      const documents = !item.Documents ? '' : item.Documents[0];
      for (const [key, value] of Object.entries(documents)) {
        if (key === 'SalesInvoice') {
          invoice['invoiceNumber'] = documents.SalesInvoice[0].InvoiceNumber[0];
        }
        if (key === 'SalesOrder') {
          invoice['orderNumber'] = documents.SalesOrder[0].OrderNumber[0];
        }
      }

      salesInvoiceList.push(invoice);
    }

    return salesInvoiceList;
  }

  /**
   * Save one salespayment as a payment object
   * @param dataset as ISalesPayment
   */
  async saveSalesPaymentByDataSet(dataset: ISalesPayment) {
    const xml = js2xmlparser.parse('Root', dataset);

    console.log(xml);

    return await this._client.post('salespayment.nv', xml.replace("<?xml version='1.0'?>", ''));
  }
}
