import { NetvisorApiClient } from "..";
import { NetvisorMethod, STRING_ANSI } from "./_method";
const js2xmlparser = require('js2xmlparser');

export interface ISalesInvoice {
  salesInvoice: {
    salesInvoiceNumber: number,
    salesInvoiceDate: { '@': {format: STRING_ANSI}, '#': string },
    salesInvoiceEventDate: { '@': {format: STRING_ANSI}, '#': string },
    salesInvoiceDueDate: { '@': {format: STRING_ANSI}, '#': string },
    salesInvoiceReferenceNumber: string,
    salesInvoiceAmount: string,
    invoiceType: string,
    salesInvoiceStatus: { '@': {type: string}, '#': string },
    invoicingCustomeridentifier: { '@': {type: string}, '#': string },
    invoicingCustomerName: string,
    invoicingCustomerAddressLine: string,
    invoicingCustomerPostNumber: string,
    invoicingCustomerTown: string,
    invoicingCustomerCountryCode: { '@': {type: string}, '#': string },
    invoiceLines: {
      invoiceLine: [
        ISalesInvoiceProductLine
      ]
    }
  }
};

export interface ISalesInvoiceProductLine {
  salesInvoiceProductLine: {
    productIdentifier: { '@': {type: string}, '#': string },
    productName: string,
    productunitPrice: { '@': {type: string}, '#': number },
    productVatPercentage: { '@': {vatcode: string}, '#': number },
    salesInvoiceProductLineQuantity: number
  }
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
    console.log(xml)
    
    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>",""));
  }

}