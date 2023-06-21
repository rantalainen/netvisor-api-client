import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as xml2js from 'xml2js';
import {
  SalesInvoiceListParameters,
  SalesInvoiceListItem,
  GetSalesInvoiceParameters,
  GetSalesInvoiceSalesInvoice,
  GetSalesInvoiceSalesInvoiceProductLine,
  SalesInvoiceParameters,
  SalesInvoice,
  SalesInvoiceProductLine
} from '../interfaces/salesinvoice';

function parseXml(xml: string) {
  const xmlParser = new xml2js.Parser({ attrkey: 'attr', charkey: 'value', explicitArray: false, normalizeTags: true });
  let xmlObject;
  xmlParser.parseString(xml, (error: any, result: any) => {
    const responseStatus = result?.root?.responsestatus?.status;
    if (responseStatus === 'OK') {
      xmlObject = result.root;
      delete xmlObject.responsestatus;
    }
  });
  return xmlObject;
}

function buildXml(obj: Object): string {
  const xmlBuilder = new xml2js.Builder({ attrkey: 'attr', charkey: 'value', headless: true });
  const xmlString: string = xmlBuilder.buildObject(obj);
  return xmlString;
}

function forceArray<T>(item: Array<T> | T): Array<T> {
  return !Array.isArray(item) ? [item] : item;
}

export class NetvisorSalesMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'salesinvoice.nv';
  }

  /**
   * Get sales invoice list. Max 500 items per request.
   * @example salesInvoiceList({ invoiceStatus: 'open', replyOptions: '1' })
   * @returns {SalesInvoiceListItem[]} If no sales invoices were retrieved, salesInvoice array will be empty.
   */
  async salesInvoiceList(params?: SalesInvoiceListParameters): Promise<SalesInvoiceListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('salesinvoicelist.nv', params);

    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return object template
    const salesInvoiceList: SalesInvoiceListItem[] = [];
    // Add items to return object
    if (xmlObject) {
      forceArray(xmlObject.salesinvoicelist.salesinvoice).forEach((xmlSalesInvoice: any) => {
        // Create template object with mandatory properties
        const salesInvoiceListItem: SalesInvoiceListItem = {
          netvisorKey: xmlSalesInvoice.netvisorkey,
          invoiceNumber: xmlSalesInvoice.invoicenumber,
          invoiceDate: xmlSalesInvoice.invoicedate,
          invoiceStatus: xmlSalesInvoice.invoicestatus,
          customerCode: xmlSalesInvoice.customercode,
          customerName: xmlSalesInvoice.customername,
          referenceNumber: xmlSalesInvoice.referencenumber,
          invoiceSum: parseFloat(xmlSalesInvoice.invoicesum.replace(',', '.')),
          openSum: parseFloat(xmlSalesInvoice.opensum.replace(',', '.')),
          uri: xmlSalesInvoice.uri
        };
        // Convert isincollection attribute to number
        salesInvoiceListItem.invoiceStatus.attr.isincollection = parseInt(xmlSalesInvoice.invoicestatus.attr.isincollection);
        // Add optional properties if they exist
        if (xmlSalesInvoice.additionalinformation) {
          // Copy the additional information to the salesInvoiceListItem
          salesInvoiceListItem.additionalInformation = {};
          // Add the properties to additional information
          if (xmlSalesInvoice.additionalinformation.privatecomment) {
            salesInvoiceListItem.additionalInformation.privateComment = xmlSalesInvoice.additionalinformation.privatecomment;
          }
          if (xmlSalesInvoice.additionalinformation.invoicecurrencysum) {
            salesInvoiceListItem.additionalInformation.invoiceCurrencySum = {
              value: parseFloat(xmlSalesInvoice.additionalinformation.invoicecurrencysum.value.replace(',', '.')),
              attr: { ...xmlSalesInvoice.additionalinformation.invoicecurrencysum.attr }
            };
          }
          if (xmlSalesInvoice.additionalinformation.opencurrencysum) {
            salesInvoiceListItem.additionalInformation.openCurrencySum = {
              value: parseFloat(xmlSalesInvoice.additionalinformation.opencurrencysum.value.replace(',', '.')),
              attr: { ...xmlSalesInvoice.additionalinformation.opencurrencysum.attr }
            };
          }
        }
        salesInvoiceList.push(salesInvoiceListItem);
      });
    }
    return salesInvoiceList;
  }

  /**
   * Get a single sales invoice with Netvisor key
   * If the sales invoice includes both product and comment lines, the original order between those two different types of lines is lost.
   * The product lines are in correct order between each other. Also, the comment lines are in order between each other.
   * @example getSalesInvoice({ netvisorKey: 123, includeAttachments: 1, showCommentLines: 1 })
   */
  async getSalesInvoice(params: GetSalesInvoiceParameters): Promise<GetSalesInvoiceSalesInvoice> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getsalesinvoice.nv', params);

    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);

    // Create the return object template
    let salesInvoice: GetSalesInvoiceSalesInvoice;

    salesInvoice = {
      salesInvoiceNetvisorKey: xmlObject.salesinvoicenetvisorkey,
      salesInvoiceNumber: xmlObject.salesinvoicenumber,
      salesInvoiceDate: xmlObject.salesinvoicedate,
      salesInvoiceEventDate: xmlObject.salesinvoiceeventdate,
      salesInvoiceValueDate: xmlObject.salesinvoicevaluedate,
      salesInvoiceDeliveryDate: xmlObject.salesinvoicedeliverydate,
      salesInvoiceDueDate: xmlObject.salesinvoiceduedate,
      salesInvoiceReferencenumber: xmlObject.salesinvoicereferencenumber,
      salesInvoiceAmount: xmlObject.salesinvoiceamount,
      sellerIdentifier: xmlObject.selleridentifier,
      invoiceStatus: xmlObject.invoicestatus,
      salesInvoiceFreeTextBeforeLines: xmlObject.salesinvoicefreetextbeforelines,
      salesInvoiceFreeTextAfterLines: xmlObject.salesinvoicefreetextafterlines,
      salesInvoiceOurReference: xmlObject.salesinvoiceourreference,
      salesInvoiceYourReference: xmlObject.salesinvoiceyourreference,
      salesInvoicePrivateComment: xmlObject.salesinvoiceprivatecomment,
      salesInvoiceAgreementIdentifier: xmlObject.salesinvoiceagreementidentifier,
      invoicingCustomerCode: xmlObject.invoicingcustomercode,
      invoicingCustomerName: xmlObject.invoicingcustomername,
      invoicingCustomerNameExtension: xmlObject.invoicingcustomernamextension,
      invoicingCustomerNetvisorKey: xmlObject.invoicingcustomernetvisorkey,
      invoicingCustomerOrganizationIdentifier: xmlObject.invoicingcustomerorganizationidentifier,
      invoicingCustomerAddressline: xmlObject.invoicingcustomeraddressline,
      invoicingCustomerAdditionalAddressLine: xmlObject.invoicingcustomeradditionaladdressline,
      invoicingCustomerPostnumber: xmlObject.invoicingcustomerpostnumber,
      invoicingCustomerTown: xmlObject.invoicingcustomertown,
      invoicingCustomerCountryCode: xmlObject.invoicingcustomercountrycode,
      matchPartialPaymentsByDefault: xmlObject.matchpartialpaymentsbydefault,
      deliveryAddressName: xmlObject.deliveryaddressname,
      deliveryAddressLine: xmlObject.deliveryaddressline,
      deliveryAddressPostnumber: xmlObject.deliveryaddresspostnumber,
      deliveryAddressTown: xmlObject.deliveryaddresstown,
      deliveryAddressCountryCode: xmlObject.deliveryaddresscountrycode,
      deliveryMethod: xmlObject.deliverymethod,
      deliveryTerm: xmlObject.deliveryterm,
      paymentTermNetDays: xmlObject.paymenttermnetdays,
      paymentTermCashDiscountDays: xmlObject.paymenttermcashdiscountdays,
      paymentTermCashDiscount: xmlObject.paymenttermcashdiscount,
      waybillIdentifier: xmlObject.waybillidentifier,
      taxHandlingClause: xmlObject.taxhandlingclause,
      deliveryOfficeIdentifier: xmlObject.deliveryofficeidentifier,
      invoiceLines: {
        invoiceLine: {}
      }
    };

    // Add optional properties if they exist in the original xml file
    if (xmlObject.salesinvoiceamount.attr?.currencyrate) {
      salesInvoice.salesInvoiceAmount.attr.currencyrate = parseInt(xmlObject.salesinvoiceamount.attr.currencyrate);
    }
    if (xmlObject.foreigncurrencyamount) {
      salesInvoice.foreignCurrencyAmount = parseFloat(xmlObject.foreigncurrencyamount.replace(',', '.'));
    }
    if (xmlObject.salesinvoicecollectioncost) {
      salesInvoice.salesInvoiceCollectionCost = parseFloat(xmlObject.salesinvoicecollectioncost.replace(',', '.'));
    }
    if (xmlObject.invoicevoucher) salesInvoice.invoiceVoucher = xmlObject.invoicevoucher;
    if (xmlObject.deliverytocustomerdate) salesInvoice.deliveryToCustomerDate = xmlObject.deliverytocustomerdate;
    if (xmlObject.deliverytocustomerweek) salesInvoice.deliveryToCustomerWeek = xmlObject.deliverytocustomerweek;
    if (xmlObject.contactpersonnetvisorkey) {
      salesInvoice.contactPersonNetvisorKey = parseInt(xmlObject.contactpersonnetvisorkey);
    }
    if (xmlObject.contactpersonfirstname) salesInvoice.contactPersonFirstName = xmlObject.contactpersonfirstname;
    if (xmlObject.contactpersonlastname) salesInvoice.contactPersonLastName = xmlObject.contactpersonlastname;
    if (xmlObject.contactpersonphonenumber) salesInvoice.contactPersonPhoneNumber = xmlObject.contactpersonphonenumber;
    if (xmlObject.contactpersonemail) salesInvoice.contactPersonEmail = xmlObject.contactpersonemail;
    if (xmlObject.lastsentinvoicepdfbase64data) salesInvoice.lastSentInvoicePDFBase64Data = xmlObject.lastsentinvoicepdfbase64data;
    if (xmlObject.creditedinvoicenetvisorkey) salesInvoice.creditedInvoiceNetvisorKey = parseInt(xmlObject.creditedinvoicenetvisorkey);
    if (xmlObject.salesinvoiceattachments) {
      salesInvoice.salesInvoiceAttachments = { salesInvoiceAttachment: [] };
      forceArray(xmlObject.salesinvoiceattachments.salesinvoiceattachment).forEach((attch: any) => {
        salesInvoice.salesInvoiceAttachments?.salesInvoiceAttachment.push({
          mimeType: attch.mimetype,
          attachmentDescription: attch.attachmentdescription,
          fileName: attch.filename,
          documentData: attch.documentdata
        });
      });
    }
    if (xmlObject.documents) {
      salesInvoice.documents = { salesOrder: [] };
      forceArray(xmlObject.documents.salesorder).forEach((order: any) => {
        salesInvoice.documents?.salesOrder.push({
          netvisorKey: order.netvisorkey,
          orderNumber: order.ordernumber
        });
      });
    }

    // Add invoice product lines if there is any
    if (xmlObject.invoicelines.invoiceline.salesinvoiceproductline) {
      // Add array to the main sales invoice object for invoice product lines
      salesInvoice.invoiceLines.invoiceLine.salesInvoiceProductLine = [];
      // Loop through the product lines in xml object and add them to the array
      forceArray(xmlObject.invoicelines.invoiceline.salesinvoiceproductline).forEach((xmlProductLine) => {
        const productLine: GetSalesInvoiceSalesInvoiceProductLine = {
          netvisorKey: xmlProductLine.netvisorkey,
          productIdentifier: xmlProductLine.productidentifier,
          productName: xmlProductLine.productname,
          productNetvisorKey: xmlProductLine.productnetvisorkey,
          productUnitPrice: parseFloat(xmlProductLine.productunitprice.replace(',', '.')),
          productPurchasePrice: parseFloat(xmlProductLine.productpurchaseprice.replace(',', '.')),
          productVatPercentage: xmlProductLine.productvatpercentage,
          productPrimaryEanCode: xmlProductLine.productprimaryeancode,
          productSecondaryEanCode: xmlProductLine.productsecondaryeancode,
          salesInvoiceProductLineQuantity: parseFloat(xmlProductLine.salesinvoiceproductlinequantity.replace(',', '.')),
          salesInvoiceProductLineUnit: xmlProductLine.salesinvoiceproductlineunit,
          salesInvoiceProductLineDiscountPercentage: parseFloat(xmlProductLine.salesinvoiceproductlinediscountpercentage.replace(',', '.')),
          salesInvoiceProductLineFreeText: xmlProductLine.salesinvoiceproductlinefreetext,
          salesInvoiceProductLineVatSum: parseFloat(xmlProductLine.salesinvoiceproductlinevatsum.replace(',', '.')),
          salesInvoiceProductLineSum: parseFloat(xmlProductLine.salesinvoiceproductlinesum.replace(',', '.')),
          accountingAccountSuggestion: xmlProductLine.accountingaccountsuggestion,
          accountingAccountSuggestionAccountNumber: xmlProductLine.accountingaccountsuggestionaccountnumber,
          provisionPercentage: xmlProductLine.provisionpercentage
        };
        // Add optional properties if they exist in the original xml invoice line
        if (xmlProductLine.salesinvoiceproductlinedeliverydate) {
          productLine.salesInvoiceProductLineDeliveryDate = xmlProductLine.salesinvoiceproductlinedeliverydate;
        }
        if (xmlProductLine.salesinvoiceproductlineinventoryid) {
          productLine.salesInvoiceProductLineInventoryID = xmlProductLine.salesinvoiceproductlineinventoryid;
        }
        if (xmlProductLine.salesinvoiceproductlineinventoryname) {
          productLine.salesInvoiceProductLineInventoryName = xmlProductLine.salesinvoiceproductlineinventoryname;
        }
        if (xmlProductLine.dimension) {
          productLine.dimension = [];
          forceArray(xmlProductLine.dimension).forEach((dimension) => {
            productLine.dimension?.push({
              dimensionName: dimension.dimensionname,
              dimensionItem: dimension.dimensionitem
            });
          });
        }
        salesInvoice.invoiceLines.invoiceLine.salesInvoiceProductLine?.push(productLine);
      });
    }

    // Add invoice comment lines if there is any
    if (xmlObject.invoicelines.invoiceline.salesinvoicecommentline) {
      // Add array to the main sales invoice object for invoice comment lines
      salesInvoice.invoiceLines.invoiceLine.salesInvoiceCommentLine = [];
      // Loop through the comment lines in xml object and add them to the array
      forceArray(xmlObject.invoicelines.invoiceline.salesinvoiceproductline).forEach((xmlCommentLine) => {
        salesInvoice.invoiceLines.invoiceLine.salesInvoiceCommentLine?.push(xmlCommentLine);
      });
    }

    return salesInvoice;
  }

  /**
   * Save one invoice as a invoice object
   * @param dataset as ISalesInvoice
   */
  async salesInvoice(dataset: SalesInvoice, params: SalesInvoiceParameters) {
    const xml = buildXml(dataset);

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''), params);
  }
}
