import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as js2xmlparser from 'js2xmlparser';
import * as xml2js from 'xml2js';
import { IPurchaseInvoice, IPurchaseInvoiceLineOutput, IPurchaseInvoiceOutput, IPurchaseOrderOutput } from '../intefaces/purchaseinvoice';

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

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''));
  }

  /**
   * Fetch complete purchase invoices
   * @param params as filtering
   */
  async getPurchaseInvoices(params: any): Promise<IPurchaseInvoiceOutput[]> {
    const purhcasesRaw = await this._client.get('purchaseinvoicelist.nv', params);

    var parser = new xml2js.Parser();

    const purchasesList: Array<any> = await new Promise(async (resolve, reject) => {
      parser.parseString(purhcasesRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json: any = xmlResult.Root.PurchaseInvoiceList[0].PurchaseInvoice;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    // purchasesList returns undefined if no invoices in search criteria
    if (!purchasesList) {
      return [];
    }

    const invoiceKeys = [];
    for (const item of purchasesList) {
      invoiceKeys.push(item.NetvisorKey[0]);
    }

    return await this.getPurchaseInvoicesByNetvisorKeyList(invoiceKeys);
  }

  async getPurchaseInvoicesByNetvisorKeyList(invoiceKeys: string[] | number[]): Promise<IPurchaseInvoiceOutput[]> {
    // If invoiceList contains more than 100 -> must split invoices fetch
    const limit = 100;
    let offset = 0;
    const invoices = [];

    do {
      const newArr = invoiceKeys.slice(offset, limit + offset);

      const invoicesRaw = await this._client.get('getpurchaseinvoice.nv', { netvisorkeylist: newArr.join(',') });

      var parser = new xml2js.Parser();

      const invoicesPart: Array<any> = await new Promise(async (resolve, reject) => {
        parser.parseString(invoicesRaw, (error: string, xmlResult: any) => {
          if (error) return reject(error);

          const status: any = xmlResult.Root.ResponseStatus[0].Status;
          // console.log(xmlResult.Root.PurchaseInvoices);
          const json = newArr.length > 1 ? xmlResult.Root.PurchaseInvoices[0].PurchaseInvoice : xmlResult.Root.PurchaseInvoice;

          if (status[0] === 'OK') {
            resolve(json);
          } else {
            reject(status[1]);
          }
        });
      });

      invoices.push(...invoicesPart);

      offset = offset + limit;
    } while (offset < invoiceKeys.length);

    // Format invoicedata as simple JSON
    const purchaseInvoiceList = [];

    for (const item of invoices) {
      const invoiceRows: IPurchaseInvoiceLineOutput[] = !item.InvoiceLines ? [] : item.InvoiceLines[0].PurchaseInvoiceLine;

      for (const row of invoiceRows) {
        for (const [key, value] of Object.entries(row)) {
          if (Array.isArray(value)) {
            row[key] = value[0];
          }
        }
      }

      const purchaseOrders = !item.LinkedPurchaseOrders ? [] : item.LinkedPurchaseOrders[0].PurchaseOrder;

      for (const o of purchaseOrders) {
        for (const [key, value] of Object.entries(o)) {
          if (Array.isArray(value)) {
            o[key] = value[0];
          }
        }
      }

      const invoice: IPurchaseInvoiceOutput = {
        purchaseInvoiceNetvisorKey: item.PurchaseInvoiceNetvisorKey[0],
        purchaseInvoiceNumber: item.PurchaseInvoiceNumber[0],
        purchaseInvoiceDate: item.PurchaseInvoiceDate[0]._,
        purchaseInvoiceEventDate: item.PurchaseInvoiceEventDate[0]._,
        purchaseInvoiceDeliveryDate: item.PurchaseInvoiceDeliveryDate[0]._,
        purchaseInvoiceDueDate: item.PurchaseInvoiceDueDate[0]._,
        purchaseInvoiceValueDate: item.PurchaseInvoiceValueDate[0]?._ || '',
        purchaseInvoiceReferencenumber: item.PurchaseInvoiceReferencenumber[0],
        purchaseInvoiceVendorBankAccountNumber: item.PurchaseInvoiceVendorBankAccountNumber[0],
        isPurchaseInvoiceVendorBankAccountDeleted: item.IsPurchaseInvoiceVendorBankAccountDeleted[0],
        isPurchaseInvoiceVendorBankAccountFromSEPARegion: item.IsPurchaseInvoiceVendorBankAccountFromSEPARegion[0],
        purchaseInvoiceAmount: item.PurchaseInvoiceAmount[0],
        purchaseInvoicePaidAmount: item.PurchaseInvoicePaidAmount[0],
        foreignCurrencyAmount: item.ForeignCurrencyAmount[0],
        foreignCurrencyNameID: item.ForeignCurrencyNameID[0],
        invoiceStatus: item.InvoiceStatus[0],
        approvalStatus: item.ApprovalStatus[0],
        purchaseInvoiceOurReference: item.PurchaseInvoiceOurReference[0],
        purchaseInvoiceYourReference: item.PurchaseInvoiceYourReference[0],
        purchaseInvoiceDescription: item.PurchaseInvoiceDescription[0],
        vendorNetvisorKey: item.VendorNetvisorKey[0],
        vendorOrganizationIdentifier: item.VendorOrganizationIdentifier[0],
        vendorCode: item.VendorCode[0],
        vendorName: item.VendorName[0],
        vendorAddressline: item.VendorAddressline[0],
        vendorPostnumber: item.VendorPostnumber[0],
        vendorTown: item.VendorTown[0],
        vendorCountry: item.VendorCountry[0],
        fingerprint: item.Fingerprint[0],
        voucherID: item.VoucherID[0],
        isAccounted: item.IsAccounted[0],
        attachments: item.Attachments ? item.Attachments[0] : '',
        invoiceLines: invoiceRows,
        linkedPurchaseOrders: purchaseOrders
      };

      purchaseInvoiceList.push(invoice);
    }

    return purchaseInvoiceList;
  }

  /**
   * Fetch complete purchase orders
   * @param params as filtering
   */
  async getPurchaseOrders(params: any): Promise<IPurchaseOrderOutput[]> {
    const purhcasesRaw = await this._client.get('purchaseorderlist.nv', params);

    var parser = new xml2js.Parser();

    const purchasesList: Array<any> = await new Promise(async (resolve, reject) => {
      parser.parseString(purhcasesRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json: any = xmlResult.Root.PurchaseOrderList[0].PurchaseOrder;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    // purchasesList returns undefined if no invoices in search criteria
    if (!purchasesList) {
      return [];
    }

    const invoiceKeys = [];
    for (const item of purchasesList) {
      invoiceKeys.push(item.NetvisorKey[0]);
    }

    return await this.getPurchaseOrdersByNetvisorKeyList(invoiceKeys);
  }

  async getPurchaseOrdersByNetvisorKeyList(orderKeys: string[] | number[]): Promise<IPurchaseOrderOutput[]> {
    const limit = 100;
    let offset = 0;
    const orders = [];

    do {
      const newArr = orderKeys.slice(offset, limit + offset);

      const ordersRaw = await this._client.get('getpurchaseorder.nv', { netvisorkeylist: newArr.join(',') });

      var parser = new xml2js.Parser();

      const ordersPart: Array<any> = await new Promise(async (resolve, reject) => {
        parser.parseString(ordersRaw, (error: string, xmlResult: any) => {
          if (error) return reject(error);

          const status: any = xmlResult.Root.ResponseStatus[0].Status;
          const json = orderKeys.length > 1 ? xmlResult.Root.PurchaseOrders[0].PurchaseOrder : xmlResult.Root.PurchaseOrder;

          if (status[0] === 'OK') {
            resolve(json);
          } else {
            reject(status[1]);
          }
        });
      });

      orders.push(...ordersPart);

      offset = offset + limit;
    } while (offset < orderKeys.length);

    // Format orderdata as simple JSON
    const purchaseOrderList = [];

    for (const item of orders) {
      const orderRows = !item.PurchaseOrderLines ? [] : item.PurchaseOrderLines[0].PurchaseOrderProductLine;

      for (const row of orderRows) {
        for (const [key, value] of Object.entries(row)) {
          if (Array.isArray(value)) {
            row[key] = value[0];
          }
        }
      }

      const purchaseInvoices = !item.PurchaseOrderLines[0].LinkedPurchaseInvoices[0].PurchaseInvoice
        ? []
        : item.PurchaseOrderLines[0].LinkedPurchaseInvoices[0].PurchaseInvoice;

      for (const o of purchaseInvoices) {
        for (const [key, value] of Object.entries(o)) {
          if (Array.isArray(value)) {
            o[key] = value[0];
          }
        }
      }

      const vendorCountry = !!item.VendorCountry[0]._ ? item.VendorCountry[0]._ : '';
      const deliveryCountry = !!item.DeliveryCountry[0]._ ? item.DeliveryCountry[0]._ : '';

      let currencyCode = 'EUR';
      if (!!item.Amount[0].$) {
        currencyCode = item.Amount[0].$.currencycode;
      }

      const order: IPurchaseOrderOutput = {
        netvisorKey: item.NetvisorKey[0],
        orderNumber: item.OrderNumber[0],

        orderStatus: item.OrderStatus[0],
        orderDate: item.OrderDate[0]._,

        vendorName: item.VendorName[0],
        vendorAddressLine: item.VendorAddressLine[0],
        vendorPostNumber: item.VendorPostNumber[0],
        VendorCity: item.VendorCity[0],
        vendorCountry,

        deliveryTerm: item.DeliveryTerm[0],
        deliveryMethod: item.DeliveryMethod[0],
        deliveryName: item.DeliveryName[0],
        deliveryAddressLine: item.DeliveryAddressLine[0],
        deliveryPostNumber: item.DeliveryPostNumber[0],
        deliveryCity: item.DeliveryCity[0],
        deliveryCountry,

        privateComment: item.PrivateComment[0],
        comment: item.Comment[0],
        ourReference: item.OurReference[0],
        paymentTerm: item.PaymentTerm[0],

        currencyCode,
        amount: item.Amount[0]._,

        purchaseOrderLines: orderRows,
        linkedPurchaseInvoices: purchaseInvoices
      };

      purchaseOrderList.push(order);
    }

    return purchaseOrderList;
  }
}
