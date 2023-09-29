import { NetvisorApiClient } from '..';
import { NetvisorMethod, forceArray, parseXml, buildXml } from './_method';
import {
  SalesInvoiceListParameters,
  SalesInvoiceListItem,
  GetSalesInvoiceParameters,
  GetSalesInvoiceSalesInvoice,
  GetSalesInvoiceSalesInvoiceProductLine,
  SalesInvoiceParameters,
  SalesInvoice
} from '../interfaces/salesinvoices';

export class NetvisorSalesMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get sales invoice list. Max 500 items per request.
   * @example await salesInvoiceList({ invoiceStatus: 'open', replyOptions: '1' })
   * @returns {SalesInvoiceListItem[]} If no sales invoices were retrieved, empty array will be returned.
   */
  async salesInvoiceList(params?: SalesInvoiceListParameters): Promise<SalesInvoiceListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('salesinvoicelist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const salesInvoiceList: SalesInvoiceListItem[] = [];
    // Add items to return array
    if (xmlObject.salesinvoicelist.salesinvoice) {
      forceArray(xmlObject.salesinvoicelist.salesinvoice).forEach((xmlSalesInvoice) => {
        // Create template object with mandatory properties
        const salesInvoiceListItem: SalesInvoiceListItem = {
          netvisorKey: parseInt(xmlSalesInvoice.netvisorkey),
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
        // Convert isincollection attribute to number if there is any attributes
        if (xmlSalesInvoice.invoicestatus.attr) {
          salesInvoiceListItem.invoiceStatus.attr.isincollection = parseInt(xmlSalesInvoice.invoicestatus.attr.isincollection);
        }
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
   * Get invoice(s) with Netvisor key
   * If the sales invoice includes both product and comment lines, the original order between those two different types of lines is lost.
   * The product lines are in correct order between each other. Also, the comment lines are in order between each other.
   * @example await getSalesInvoice({ netvisorKey: 123, includeAttachments: 1, showCommentLines: 1 })
   * @returns {GetSalesInvoiceSalesInvoice[]} Returns array even if only one sales invoice was retrieved.
   */
  async getSalesInvoice(params: GetSalesInvoiceParameters): Promise<GetSalesInvoiceSalesInvoice[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getsalesinvoice.nv', params);
    return this.parseSalesInvoiceOrSalesOrder(responseXml);
  }

  /**
   * Get sales order(s) with Netvisor key
   * If the sales order includes both product and comment lines, the original order between those two different types of lines is lost.
   * The product lines are in correct order between each other. Also, the comment lines are in order between each other.
   * @example await getSalesOrder({ netvisorKey: 123})
   * @returns {GetSalesInvoiceSalesInvoice[]} Returns array even if only one sales order was retrieved.
   */
  async getSalesOrder(params: GetSalesInvoiceParameters): Promise<GetSalesInvoiceSalesInvoice[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getorder.nv', params);
    return this.parseSalesInvoiceOrSalesOrder(responseXml);
  }

  /**
   * Create an invoice or sales order to Netvisor. If you are creating a new sales invoice, check required fields from Netvisor's documentation.
   * @example await salesInvoice(salesInvoice, { method: 'add' })
   * @returns the added sales invoice's netvisor key
   */
  async salesInvoice(salesInvoice: SalesInvoice, params: SalesInvoiceParameters): Promise<string> {
    const response = await this._client.post('salesinvoice.nv', buildXml({ root: { salesInvoice: salesInvoice } }), params);
    if (params.method === 'add') return parseXml(response).replies.inserteddataidentifier;
    return params.id?.toString() || '';
  }

  private async parseSalesInvoiceOrSalesOrder(responseXml: string): Promise<GetSalesInvoiceSalesInvoice[]> {
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);

    // Create the return array
    const salesInvoices: GetSalesInvoiceSalesInvoice[] = [];

    // Create the return object template
    let xmlSalesInvoices: any[] = [];
    if (xmlObject.salesinvoices) {
      if (xmlObject.salesinvoices.salesinvoice) {
        // If there were multiple sales invoices/orders in the result
        xmlSalesInvoices = forceArray(xmlObject.salesinvoices.salesinvoice);
      }
    } else if (xmlObject.salesinvoice) {
      // If there were a single invoice/order in the result
      xmlSalesInvoices = forceArray(xmlObject.salesinvoice);
    }

    xmlSalesInvoices.forEach((xmlSalesInvoice) => {
      const salesInvoice: GetSalesInvoiceSalesInvoice = {
        salesInvoiceNetvisorKey: xmlSalesInvoice.salesinvoicenetvisorkey,
        salesInvoiceNumber: xmlSalesInvoice.salesinvoicenumber,
        salesInvoiceDate: xmlSalesInvoice.salesinvoicedate,
        salesInvoiceEventDate: xmlSalesInvoice.salesinvoiceeventdate,
        salesInvoiceValueDate: xmlSalesInvoice.salesinvoicevaluedate,
        salesInvoiceDeliveryDate: xmlSalesInvoice.salesinvoicedeliverydate,
        salesInvoiceDueDate: xmlSalesInvoice.salesinvoiceduedate,
        salesInvoiceReferencenumber: xmlSalesInvoice.salesinvoicereferencenumber,
        salesInvoiceAmount: xmlSalesInvoice.salesinvoiceamount,
        sellerIdentifier: xmlSalesInvoice.selleridentifier,
        invoiceStatus: xmlSalesInvoice.invoicestatus,
        salesInvoiceFreeTextBeforeLines: xmlSalesInvoice.salesinvoicefreetextbeforelines,
        salesInvoiceFreeTextAfterLines: xmlSalesInvoice.salesinvoicefreetextafterlines,
        salesInvoiceOurReference: xmlSalesInvoice.salesinvoiceourreference,
        salesInvoiceYourReference: xmlSalesInvoice.salesinvoiceyourreference,
        salesInvoicePrivateComment: xmlSalesInvoice.salesinvoiceprivatecomment,
        salesInvoiceAgreementIdentifier: xmlSalesInvoice.salesinvoiceagreementidentifier,
        invoicingCustomerCode: xmlSalesInvoice.invoicingcustomercode,
        invoicingCustomerName: xmlSalesInvoice.invoicingcustomername,
        invoicingCustomerNameExtension: xmlSalesInvoice.invoicingcustomernameextension,
        invoicingCustomerNetvisorKey: xmlSalesInvoice.invoicingcustomernetvisorkey,
        invoicingCustomerOrganizationIdentifier: xmlSalesInvoice.invoicingcustomerorganizationidentifier,
        invoicingCustomerAddressline: xmlSalesInvoice.invoicingcustomeraddressline,
        invoicingCustomerAdditionalAddressLine: xmlSalesInvoice.invoicingcustomeradditionaladdressline,
        invoicingCustomerPostnumber: xmlSalesInvoice.invoicingcustomerpostnumber,
        invoicingCustomerTown: xmlSalesInvoice.invoicingcustomertown,
        invoicingCustomerCountryCode: xmlSalesInvoice.invoicingcustomercountrycode,
        matchPartialPaymentsByDefault: xmlSalesInvoice.matchpartialpaymentsbydefault,
        deliveryAddressName: xmlSalesInvoice.deliveryaddressname,
        deliveryAddressLine: xmlSalesInvoice.deliveryaddressline,
        deliveryAddressPostnumber: xmlSalesInvoice.deliveryaddresspostnumber,
        deliveryAddressTown: xmlSalesInvoice.deliveryaddresstown,
        deliveryAddressCountryCode: xmlSalesInvoice.deliveryaddresscountrycode,
        deliveryMethod: xmlSalesInvoice.deliverymethod,
        deliveryTerm: xmlSalesInvoice.deliveryterm,
        paymentTermNetDays: xmlSalesInvoice.paymenttermnetdays,
        paymentTermCashDiscountDays: xmlSalesInvoice.paymenttermcashdiscountdays,
        paymentTermCashDiscount: xmlSalesInvoice.paymenttermcashdiscount,
        waybillIdentifier: xmlSalesInvoice.waybillidentifier,
        taxHandlingClause: xmlSalesInvoice.taxhandlingclause,
        deliveryOfficeIdentifier: xmlSalesInvoice.deliveryofficeidentifier,
        invoiceLines: {
          invoiceLine: {}
        }
      };

      // Convert numeric values to number
      if (xmlSalesInvoice.salesinvoiceamount.value) {
        salesInvoice.salesInvoiceAmount.value = parseFloat(xmlSalesInvoice.salesinvoiceamount.value.replace(',', '.'));
      }

      // Add optional properties if they exist in the original xml file
      if (xmlSalesInvoice.salesinvoiceamount.attr?.currencyrate) {
        salesInvoice.salesInvoiceAmount.attr.currencyrate = parseFloat(
          xmlSalesInvoice.salesinvoiceamount.attr.currencyrate.replace(',', '.')
        );
      }
      if (xmlSalesInvoice.foreigncurrencyamount) {
        salesInvoice.foreignCurrencyAmount = parseFloat(xmlSalesInvoice.foreigncurrencyamount.replace(',', '.'));
      }
      if (xmlSalesInvoice.salesinvoicecollectioncost) {
        salesInvoice.salesInvoiceCollectionCost = parseFloat(xmlSalesInvoice.salesinvoicecollectioncost.replace(',', '.'));
      }
      if (xmlSalesInvoice.invoicevoucher) salesInvoice.invoiceVoucher = xmlSalesInvoice.invoicevoucher;
      if (xmlSalesInvoice.deliverytocustomerdate) salesInvoice.deliveryToCustomerDate = xmlSalesInvoice.deliverytocustomerdate;
      if (xmlSalesInvoice.deliverytocustomerweek) salesInvoice.deliveryToCustomerWeek = xmlSalesInvoice.deliverytocustomerweek;
      if (xmlSalesInvoice.contactpersonnetvisorkey) {
        salesInvoice.contactPersonNetvisorKey = parseInt(xmlSalesInvoice.contactpersonnetvisorkey);
      }
      if (xmlSalesInvoice.contactpersonfirstname) salesInvoice.contactPersonFirstName = xmlSalesInvoice.contactpersonfirstname;
      if (xmlSalesInvoice.contactpersonlastname) salesInvoice.contactPersonLastName = xmlSalesInvoice.contactpersonlastname;
      if (xmlSalesInvoice.contactpersonphonenumber) salesInvoice.contactPersonPhoneNumber = xmlSalesInvoice.contactpersonphonenumber;
      if (xmlSalesInvoice.contactpersonemail) salesInvoice.contactPersonEmail = xmlSalesInvoice.contactpersonemail;
      if (xmlSalesInvoice.lastsentinvoicepdfbase64data)
        salesInvoice.lastSentInvoicePDFBase64Data = xmlSalesInvoice.lastsentinvoicepdfbase64data;
      if (xmlSalesInvoice.creditedinvoicenetvisorkey)
        salesInvoice.creditedInvoiceNetvisorKey = parseInt(xmlSalesInvoice.creditedinvoicenetvisorkey);
      if (xmlSalesInvoice.salesinvoiceattachments) {
        salesInvoice.salesInvoiceAttachments = { salesInvoiceAttachment: [] };
        forceArray(xmlSalesInvoice.salesinvoiceattachments.salesinvoiceattachment).forEach((attch: any) => {
          salesInvoice.salesInvoiceAttachments!.salesInvoiceAttachment.push({
            mimeType: attch.mimetype,
            attachmentDescription: attch.attachmentdescription,
            fileName: attch.filename,
            documentData: attch.documentdata
          });
        });
      }
      if (xmlSalesInvoice.documents) {
        salesInvoice.documents = [];
        forceArray(xmlSalesInvoice.documents.salesorder).forEach((order: any) => {
          salesInvoice.documents!.push({
            salesOrder: {
              netvisorKey: parseInt(order.netvisorkey),
              orderNumber: parseInt(order.ordernumber)
            }
          });
        });
      }

      // Add invoice product lines if there is any
      if (xmlSalesInvoice.invoicelines.invoiceline.salesinvoiceproductline) {
        // Add array to the main sales invoice object for invoice product lines
        salesInvoice.invoiceLines.invoiceLine.salesInvoiceProductLine = [];
        // Loop through the product lines in xml object and add them to the array
        forceArray(xmlSalesInvoice.invoicelines.invoiceline.salesinvoiceproductline).forEach((xmlProductLine) => {
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
            salesInvoiceProductLineDiscountPercentage: parseFloat(
              xmlProductLine.salesinvoiceproductlinediscountpercentage.replace(',', '.')
            ),
            salesInvoiceProductLineFreeText: xmlProductLine.salesinvoiceproductlinefreetext,
            salesInvoiceProductLineVatSum: parseFloat(xmlProductLine.salesinvoiceproductlinevatsum.replace(',', '.')),
            salesInvoiceProductLineSum: parseFloat(xmlProductLine.salesinvoiceproductlinesum.replace(',', '.')),
            accountingAccountSuggestion: parseInt(xmlProductLine.accountingaccountsuggestion) || null,
            accountingAccountSuggestionAccountNumber: parseInt(xmlProductLine.accountingaccountsuggestionaccountnumber) || null,
            provisionPercentage: parseFloat(xmlProductLine.provisionpercentage.replace(',', '.'))
          };
          // Add optional properties if they exist in the original xml invoice line
          if (xmlProductLine.salesinvoiceproductlinedeliverydate) {
            productLine.salesInvoiceProductLineDeliveryDate = xmlProductLine.salesinvoiceproductlinedeliverydate;
          }
          if (xmlProductLine.salesinvoiceproductlineinventoryid) {
            productLine.salesInvoiceProductLineInventoryID = parseInt(xmlProductLine.salesinvoiceproductlineinventoryid);
          }
          if (xmlProductLine.salesinvoiceproductlineinventoryname) {
            productLine.salesInvoiceProductLineInventoryName = xmlProductLine.salesinvoiceproductlineinventoryname;
          }
          if (xmlProductLine.dimension) {
            productLine.dimension = [];
            forceArray(xmlProductLine.dimension).forEach((dimension) => {
              productLine.dimension!.push({
                dimensionName: dimension.dimensionname,
                dimensionItem: dimension.dimensionitem
              });
            });
          }
          salesInvoice.invoiceLines.invoiceLine.salesInvoiceProductLine!.push(productLine);
        });
      }

      // Add invoice comment lines if there is any
      if (xmlSalesInvoice.invoicelines.invoiceline.salesinvoicecommentline) {
        // Add array to the main sales invoice object for invoice comment lines
        salesInvoice.invoiceLines.invoiceLine.salesInvoiceCommentLine = [];
        // Loop through the comment lines in xml object and add them to the array
        forceArray(xmlSalesInvoice.invoicelines.invoiceline.salesinvoicecommentline).forEach((xmlCommentLine) => {
          salesInvoice.invoiceLines.invoiceLine.salesInvoiceCommentLine!.push(xmlCommentLine);
        });
      }
      salesInvoices.push(salesInvoice);
    });

    return salesInvoices;
  }
}
