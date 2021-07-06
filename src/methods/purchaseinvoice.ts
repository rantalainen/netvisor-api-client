import { NetvisorApiClient } from "..";
import { NetvisorMethod, STRING_ANSI } from "./_method";
const js2xmlparser = require('js2xmlparser');

export interface IPurchaseInvoice {
  purchaseinvoice: {
    invoicenumber: number;
    invoicedate: { '@': {format: STRING_ANSI}, '#': string };
    invoicesource: string;
    valuedate: { '@': {format: STRING_ANSI}, '#': string };
    eventdate: { '@': {format: STRING_ANSI}, '#': string };
    duedate: { '@': {format: STRING_ANSI}, '#': string };
    purchaseinvoiceonround: { '@': {type: string}, '#': string };
    vendorcode: string;
    vendorname: string;
    vendoraddressline: string;
    vendorpostnumber: string;
    vendorcity: string;
    vendorcountry: string;
    amount: number;
    accountnumber: string
    organizationidentifier: string;
    bankreferencenumber: string;
    ourreference?: string;
    yourreference?: string;
    currencycode: string;
    readyforaccounting: string;
    primaryvendormatchtype: string;
    purchaseinvoicelines: {
      purchaseinvoiceline: [
        IPurchaseInvoiceLine
      ]
    }
  }
}

export interface IPurchaseInvoiceLine {
  purchaseinvoiceline: {
    productcode: any;
    productname: string;
    deliveredamount: number;
    unitprice: number;
    vatpercent: number;
    linesum: { '@': {type: string}, '#': number };
    description: string; 
    accountingsuggestion: number;
  }
}

export class NetvisorPurchaseInvoiceMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
    
    this._endpointUri = 'purchaseinvoice.nv';
  }

  /**
   * Save one invoice as a invoice object
   * @param dataset as IPurchaseInvoice
   */
   async saveInvoiceByDataSet(dataset: IPurchaseInvoice) {

    const xml = js2xmlparser.parse('Root', dataset);
    console.log(xml)
    
    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>",""));
  }

}