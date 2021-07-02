import { NetvisorApiClient } from "..";
import { NetvisorMethod } from "./_method";
const js2xmlparser = require('js2xmlparser');

export interface ISalesInvoice {
  salesInvoice: {
    salesInvoiceNumber: number,
    salesInvoiceDate: { '@': {format: 'ansi'}, '#': string },
    salesInvoiceEventDate: { '@': {format: 'ansi'}, '#': string },
    salesInvoiceDueDate: { '@': {format: 'ansi'}, '#': string },
    salesInvoiceReferenceNumber: string,
    salesInvoiceAmount: string,
    invoiceType: string,
    salesInvoiceStatus: { '@': {type: 'netvisor'}, '#': string },
    invoicingCustomeridentifier: { '@': {type: 'customer'}, '#': string },
    invoicingCustomerName: string,
    invoicingCustomerAddressLine: string,
    invoicingCustomerPostNumber: string,
    invoicingCustomerTown: string,
    invoicingCustomerCountryCode: { '@': {type: 'ISO-3316'}, '#': string },
    invoiceLines: {
      invoiceLine: {
        salesInvoiceProductLine: {
          productIdentifier: { '@': {type: 'customer'}, '#': string },
          productName: string,
          productunitPrice: { '@': {type: 'net'}, '#': number },
          productVatPercentage: { '@': {vatcode: 'NONE'}, '#': number },
          salesInvoiceProductLineQuantity: number
        }
      }
    }
  }
};


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
    
    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>",""));
  }

}