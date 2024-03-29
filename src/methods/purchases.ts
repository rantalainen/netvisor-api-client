import { NetvisorApiClient } from '..';
import {
  GetVendorParameters,
  GetVendor,
  PurchaseInvoice,
  PurchaseInvoiceListParameters,
  PurchaseInvoiceListItem,
  GetPurchaseInvoiceParameters,
  GetPurchaseInvoice,
  GetPurchaseInvoiceHandlingHistoryLine,
  GetPurchaseInvoiceLine,
  PurchaseOrder,
  PurchaseOrderParameters,
  PurchaseOrderListItem,
  GetPurchaseOrderParameters,
  GetPurchaseOrder,
  GetPurchaseOrderProductLine,
  LinkedInvoiceLine,
  Vendor,
  VendorParameters
} from '../interfaces/purchases';
import { NetvisorMethod, parseXml, buildXml, forceArray } from './_method';

export class NetvisorPurchasesMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get vendor(s) from Netvisor
   * @example await getVendor({ netvisorKey: 67 })
   * @returns {GetVendor[]} If no vendors were retrieved, empty array will be returned.
   */
  async getVendor(params?: GetVendorParameters): Promise<GetVendor[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getvendor.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const vendorList: GetVendor[] = [];

    // Get vendors from the xml to an array
    let xmlVendors: any[] = [];
    if (xmlObject.vendors) {
      xmlVendors = forceArray(xmlObject.vendors.vendor);
    } else if (xmlObject.vendor) {
      xmlVendors = forceArray(xmlObject.vendor);
    }

    xmlVendors.forEach((xmlVendor: any) => {
      // Add mandatory fields to the return object
      const vendor: GetVendor = {
        netvisorKey: parseInt(xmlVendor.netvisorkey),
        vendorBaseInformation: {
          name: xmlVendor.vendorbaseinformation.name,
          address: xmlVendor.vendorbaseinformation.address,
          postCode: xmlVendor.vendorbaseinformation.postcode,
          city: xmlVendor.vendorbaseinformation.city,
          country: xmlVendor.vendorbaseinformation.country,
          organizationId: xmlVendor.vendorbaseinformation.organizationid
        },
        vendorAdditionalInformation: {
          defaultVatPercent: parseFloat(xmlVendor.vendoradditionalinformation.defaultvatpercent.replace(',', '.')),
          isPartialVatReducedPrivileged: xmlVendor.vendoradditionalinformation.ispartialvatreducedprivileged === '1' ? true : false
        }
      };
      // Add optional fields
      if (xmlVendor.vendorbaseinformation.code) vendor.vendorBaseInformation.code = xmlVendor.vendorbaseinformation.code;
      if (xmlVendor.vendorbaseinformation.groupname) vendor.vendorBaseInformation.groupName = xmlVendor.vendorbaseinformation.groupname;
      if (xmlVendor.vendoradditionalinformation.paymentterm)
        vendor.vendorAdditionalInformation.paymentTerm = parseInt(xmlVendor.vendoradditionalinformation.paymentterm);
      if (xmlVendor.vendoradditionalinformation.vendordimensions) {
        vendor.vendorAdditionalInformation.vendorDimensions = { dimension: [] };
        forceArray(xmlVendor.vendoradditionalinformation.vendordimensions.dimension).forEach((xmlDimension: any) => {
          vendor.vendorAdditionalInformation.vendorDimensions!.dimension.push({
            dimensionName: xmlDimension.dimensionname,
            dimensionItem: xmlDimension.dimensionitem
          });
        });
      }
      if (xmlVendor.vendoradditionalinformation.vendoraccountingaccounts) {
        vendor.vendorAdditionalInformation.vendorAccountingAccounts = { vendorAccountingAccount: [] };
        forceArray(xmlVendor.vendoradditionalinformation.vendoraccountingaccounts.vendoraccountingaccount).forEach(
          (xmlAccountingAccount: any) => {
            vendor.vendorAdditionalInformation.vendorAccountingAccounts!.vendorAccountingAccount.push({
              accountNumber: xmlAccountingAccount.accountnumber,
              accountName: xmlAccountingAccount.accountname,
              isDefault: xmlAccountingAccount.isdefault === 'True' ? true : false
            });
          }
        );
      }
      if (xmlVendor.vendoradditionalinformation.vendoracceptancedetails) {
        vendor.vendorAdditionalInformation.vendorAcceptanceDetails = { vendorAcceptanceDetail: [] };
        forceArray(xmlVendor.vendoradditionalinformation.vendoracceptancedetails.vendoracceptancedetail).forEach(
          (xmlAcceptanceDetail: any) => {
            vendor.vendorAdditionalInformation.vendorAcceptanceDetails!.vendorAcceptanceDetail.push({
              acceptanceName: xmlAcceptanceDetail.acceptancename || '',
              isDefault: xmlAcceptanceDetail.isdefault === 'True' ? true : false,
              isForced: xmlAcceptanceDetail.isforced === 'True' ? true : false
            });
          }
        );
      }

      // Add bank accounts
      if (xmlVendor.vendorbaseinformation.vendorbankaccounts) {
        vendor.vendorBaseInformation.vendorBankAccounts = {};
        // Add domestic bank accounts
        if (xmlVendor.vendorbaseinformation.vendorbankaccounts.vendordomesticbankaccounts) {
          vendor.vendorBaseInformation.vendorBankAccounts.vendorDomesticBankAccounts = { vendorDomesticBankAccount: [] };
          forceArray(xmlVendor.vendorbaseinformation.vendorbankaccounts.vendordomesticbankaccounts.vendordomesticbankaccount).forEach(
            (xmlBankAccount: any) => {
              vendor.vendorBaseInformation.vendorBankAccounts!.vendorDomesticBankAccounts!.vendorDomesticBankAccount.push({
                netvisorKey: parseInt(xmlBankAccount.netvisorkey),
                iban: xmlBankAccount.iban,
                bankName: xmlBankAccount.bankname,
                isDefault: xmlBankAccount.isdefault === '1' ? true : false
              });
            }
          );
        }
        // Add foreign bank accounts
        if (xmlVendor.vendorbaseinformation.vendorbankaccounts.vendorforeignbankaccounts) {
          vendor.vendorBaseInformation.vendorBankAccounts.vendorForeignBankAccounts = { vendorForeignBankAccount: [] };
          forceArray(xmlVendor.vendorbaseinformation.vendorbankaccounts.vendorforeignbankaccounts.vendorforeignbankaccount).forEach(
            (xmlBankAccount: any) => {
              vendor.vendorBaseInformation.vendorBankAccounts!.vendorForeignBankAccounts!.vendorForeignBankAccount.push({
                netvisorKey: parseInt(xmlBankAccount.netvisorkey),
                bban: xmlBankAccount.bban,
                bicSwift: xmlBankAccount.bicswift,
                bankName: xmlBankAccount.bankname,
                clearingCode: xmlBankAccount.clearingcode || '',
                clearingNumber: xmlBankAccount.clearingnumber || '',
                bankAddress: xmlBankAccount.bankaddress || '',
                country: xmlBankAccount.country,
                currencyCode: xmlBankAccount.currencycode,
                isDefault: xmlBankAccount.isdefault === '1' ? true : false,
                includeAddresssInForeignPayments: xmlBankAccount.includeaddresssinforeignpayments === '1' ? true : false
              });
            }
          );
        }
      }

      // Add vendor contact details
      if (xmlVendor.vendorcontactdetails) {
        vendor.vendorContactDetails = {};
        if (xmlVendor.vendorcontactdetails.phonenumber)
          vendor.vendorContactDetails.phoneNumber = xmlVendor.vendorcontactdetails.phonenumber;
        if (xmlVendor.vendorcontactdetails.email) vendor.vendorContactDetails.phoneNumber = xmlVendor.vendorcontactdetails.email;
        if (xmlVendor.vendorcontactdetails.faxnumber) vendor.vendorContactDetails.faxNumber = xmlVendor.vendorcontactdetails.faxnumber;
        if (xmlVendor.vendorcontactdetails.contactpersonname)
          vendor.vendorContactDetails.contactPersonName = xmlVendor.vendorcontactdetails.contactpersonname;
        if (xmlVendor.vendorcontactdetails.contactpersonphonenumber)
          vendor.vendorContactDetails.contactPersonPhoneNumber = xmlVendor.vendorcontactdetails.contactpersonphonenumber;
        if (xmlVendor.vendorcontactdetails.contactpersonemail)
          vendor.vendorContactDetails.contactPersonEmail = xmlVendor.vendorcontactdetails.contactpersonemail;
        if (xmlVendor.vendorcontactdetails.homepage) vendor.vendorContactDetails.homePage = xmlVendor.vendorcontactdetails.homepage;
        if (xmlVendor.vendorcontactdetails.comment) vendor.vendorContactDetails.comment = xmlVendor.vendorcontactdetails.comment;
        if (Object.keys(vendor.vendorContactDetails).length === 0) delete vendor.vendorContactDetails;
      }
      vendorList.push(vendor);
    });
    return vendorList;
  }

  /**
   * Create or edit a vendor in Netvisor
   * @example await vendor(vendorObject, { method: 'add' })
   * @returns the added/edited vendor's netvisor key
   */
  async vendor(vendor: Vendor, params: VendorParameters): Promise<string> {
    const response = await this._client.post('vendor.nv', buildXml({ root: { vendor: vendor } }), params);
    return parseXml(response).replies.inserteddataidentifier;
  }

  /**
   * Create a purchase invoice to Netvisor
   * @example await purchaseInvoice(purchaseInvoiceObject)
   * @returns the added purhcase invoice's netvisor key
   */
  async purchaseInvoice(purchaseInvoice: PurchaseInvoice): Promise<string> {
    const response = await this._client.post('purchaseinvoice.nv', buildXml({ root: { purchaseInvoice: purchaseInvoice } }));
    return parseXml(response).replies.inserteddataidentifier;
  }

  /**
   * Get purchase invoice list from Netvisor
   * @example await purchaseInvoiceList({ beginInvoiceDate: '2023-09-01', endInvoiceDate: '2023-09-30', invoiceStatus: 'Open' });
   */
  async purchaseInvoiceList(params?: PurchaseInvoiceListParameters): Promise<PurchaseInvoiceListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('purchaseinvoicelist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const purchaseInvoiceList: PurchaseInvoiceListItem[] = [];
    // Add items to return array
    if (xmlObject.purchaseinvoicelist?.purchaseinvoice) {
      forceArray(xmlObject.purchaseinvoicelist.purchaseinvoice).forEach((xmlInvoice: any) => {
        purchaseInvoiceList.push({
          netvisorKey: parseInt(xmlInvoice.netvisorkey),
          invoiceNumber: xmlInvoice.invoicenumber,
          invoiceDate: xmlInvoice.invoicedate,
          vendor: xmlInvoice.vendor,
          vendorOrganizationIdentifier: xmlInvoice.vendororganizationidentifier,
          sum: parseFloat(xmlInvoice.sum.replace(',', '.')),
          payments: parseFloat(xmlInvoice.payments.replace(',', '.')),
          openSum: parseFloat(xmlInvoice.opensum.replace(',', '.')),
          uri: xmlInvoice.uri
        });
      });
    }

    return purchaseInvoiceList;
  }

  /**
   * Get purchase invoice(s) from Netvisor
   * @example await getPurchaseInvoice({ netvisorKey: 123 });
   */
  async getPurchaseInvoice(params: GetPurchaseInvoiceParameters): Promise<GetPurchaseInvoice[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getpurchaseinvoice.nv', { ...params, version: '2' });
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const purchaseInvoices: GetPurchaseInvoice[] = [];
    // Parse invoices from xml object
    let xmlInvoices = [];
    if (xmlObject.purchaseinvoice) {
      xmlInvoices = forceArray(xmlObject.purchaseinvoice);
    } else if (xmlObject.purchaseinvoices?.purchaseinvoice) {
      xmlInvoices = forceArray(xmlObject.purchaseinvoices.purchaseinvoice);
    }
    // Add items to return array
    xmlInvoices.forEach((xmlInvoice: any) => {
      // Create the return object with required attributes
      const purchaseInvoice: GetPurchaseInvoice = {
        purchaseInvoiceNetvisorKey: parseInt(xmlInvoice.purchaseinvoicenetvisorkey),
        purchaseInvoiceNumber: xmlInvoice.purchaseinvoicenumber,
        purchaseInvoiceDate: xmlInvoice.purchaseinvoicedate,
        purchaseInvoiceDueDate: xmlInvoice.purchaseinvoiceduedate,
        purchaseInvoiceReferenceNumber: xmlInvoice.purchaseinvoicereferencenumber || undefined,
        purchaseInvoiceAgreementIdentifier: xmlInvoice.purchaseinvoiceagreementidentifier || undefined,
        purchaseInvoiceAmount: parseFloat(xmlInvoice.purchaseinvoiceamount.replace(',', '.')),
        purchaseInvoicePaidAmount: parseFloat(xmlInvoice.purchaseinvoicepaidamount.replace(',', '.')),
        invoiceStatus: xmlInvoice.invoicestatus,
        approvalStatus: xmlInvoice.approvalstatus,
        purchaseInvoiceOurReference: xmlInvoice.purchaseinvoiceourreference || undefined,
        purchaseInvoiceYourReference: xmlInvoice.purchaseinvoiceyourreference || undefined,
        purchaseInvoiceDescription: xmlInvoice.purchaseinvoicedescription || undefined,
        vendorNetvisorKey: parseInt(xmlInvoice.vendornetvisorkey),
        vendorOrganizationIdentifier: xmlInvoice.vendororganizationidentifier || undefined,
        vendorCode: xmlInvoice.vendorcode || undefined,
        vendorName: xmlInvoice.vendorname,
        vendorAddressLine: xmlInvoice.vendoraddressline || undefined,
        vendorPostNumber: xmlInvoice.vendorpostnumber || undefined,
        vendorTown: xmlInvoice.vendortown || undefined,
        vendorCountry: xmlInvoice.vendorcountry || undefined,
        fingerprint: xmlInvoice.fingerprint,
        isAccounted: xmlInvoice.isaccounted === 'True' ? true : false,
        invoiceLines: { purchaseInvoiceLine: [] }
      };

      // Add optional attributes
      if (xmlInvoice.purchaseinvoiceeventdate?.value) purchaseInvoice.purchaseInvoiceEventDate = xmlInvoice.purchaseinvoiceeventdate;
      if (xmlInvoice.purchaseinvoicedeliverydate?.value)
        purchaseInvoice.purchaseInvoiceDeliveryDate = xmlInvoice.purchaseinvoicedeliverydate;
      if (xmlInvoice.purchaseinvoicevaluedate?.value) purchaseInvoice.purchaseInvoiceValueDate = xmlInvoice.purchaseinvoicevaluedate;
      if (xmlInvoice.purchaseinvoicevendorbankaccountnumber) {
        purchaseInvoice.purchaseInvoiceVendorBankAccountNumber = xmlInvoice.purchaseinvoicevendorbankaccountnumber;
        purchaseInvoice.isPurchaseInvoiceVendorBankAccountDeleted =
          xmlInvoice.ispurchaseinvoicevendorbankaccountdeleted === 'True' ? true : false;
        purchaseInvoice.isPurchaseInvoiceVendorBankAccountFromSEPARegion =
          xmlInvoice.ispurchaseinvoicevendorbankaccountfromseparegion === 'True' ? true : false;
      }
      if (xmlInvoice.foreigncurrencyamount) {
        purchaseInvoice.foreignCurrencyAmount = parseFloat(xmlInvoice.foreigncurrencyamount.replace(',', '.'));
        purchaseInvoice.foreignCurrencyNameID = xmlInvoice.foreigncurrencynameid || undefined;
      }
      if (xmlInvoice.voucherid) purchaseInvoice.voucherId = parseInt(xmlInvoice.voucherid);
      if (xmlInvoice.previewimage) {
        purchaseInvoice.previewImage = {
          value: xmlInvoice.previewimage.value,
          attr: { attachmentNetvisorKey: parseInt(xmlInvoice.previewimage.attr.attachmentnetvisorkey) }
        };
      }
      if (xmlInvoice.invoiceimage) {
        purchaseInvoice.invoiceImage = {
          value: xmlInvoice.invoiceimage.value,
          attr: { attachmentNetvisorKey: parseInt(xmlInvoice.invoiceimage.attr.attachmentnetvisorkey) }
        };
      }
      if (xmlInvoice.attachments?.attachment) {
        purchaseInvoice.attachments = { attachment: [] };
        forceArray(xmlInvoice.attachments.attachment).forEach((xmlAttachment: any) => {
          purchaseInvoice.attachments!.attachment.push({
            attachmentBase64Data: xmlAttachment.attachmentbase64data,
            fileName: xmlAttachment.filename,
            contentType: xmlAttachment.contenttype,
            comment: xmlAttachment.comment || undefined
          });
        });
      }
      if (xmlInvoice.linkedpurchaseorders?.purchaseorder) {
        purchaseInvoice.linkedPurchaseOrders = { purchaseOrder: [] };
        forceArray(xmlInvoice.linkedpurchaseorders.purchaseorder).forEach((xmlPurchaseOrder: any) => {
          purchaseInvoice.linkedPurchaseOrders!.purchaseOrder.push({
            orderNumber: xmlPurchaseOrder.ordernumber,
            netvisorKey: parseInt(xmlPurchaseOrder.netvisorkey) || undefined
          });
        });
      }
      if (xmlInvoice.postinglinesaccess) {
        purchaseInvoice.postingLinesAccess = {
          canEditPostingLines: xmlInvoice.postinglinesaccess.caneditpostinglines === 'True' ? true : false,
          canUserPostInvoice: xmlInvoice.postinglinesaccess.canuserpostinvoice === 'True' ? true : false,
          suggestPostingByDefault: xmlInvoice.postinglinesaccess.suggestpostingbydefault === 'True' ? true : false,
          canEditAccountingSuggestion: xmlInvoice.postinglinesaccess.caneditaccountingsuggestion === 'True' ? true : false
        };
      }
      if (xmlInvoice.actions?.action) {
        purchaseInvoice.actions = { action: [] };
        forceArray(xmlInvoice.actions.action).forEach((xmlAction: any) => {
          purchaseInvoice.actions!.action.push(xmlAction);
        });
      }
      if (xmlInvoice.alerts?.alert) {
        purchaseInvoice.alerts = { alert: [] };
        forceArray(xmlInvoice.alerts.alert).forEach((xmlAlert: any) => {
          purchaseInvoice.alerts!.alert.push(xmlAlert);
        });
      }
      if (xmlInvoice.notifications?.notification) {
        purchaseInvoice.notifications = { notification: [] };
        forceArray(xmlInvoice.notifications.notification).forEach((xmlNotification: any) => {
          purchaseInvoice.notifications!.notification.push(xmlNotification);
        });
      }
      if (xmlInvoice.handlinghistory?.handlinghistoryline) {
        purchaseInvoice.handlingHistory = { handlingHistoryLine: [] };
        forceArray(xmlInvoice.handlinghistory.handlinghistoryline).forEach((xmlHandlingHistoryLine: any) => {
          const handlingHistoryLine: GetPurchaseInvoiceHandlingHistoryLine = {
            type: xmlHandlingHistoryLine.type,
            heading: xmlHandlingHistoryLine.heading,
            description: xmlHandlingHistoryLine.description,
            timestamp: xmlHandlingHistoryLine.timestamp,
            userName: xmlHandlingHistoryLine.username,
            userEmail: xmlHandlingHistoryLine.useremail || undefined
          };
          if (xmlHandlingHistoryLine.updatedinformationfields) {
            handlingHistoryLine.updatedInformationFields = forceArray(xmlHandlingHistoryLine.updatedinformationfields);
          }
          purchaseInvoice.handlingHistory!.handlingHistoryLine.push(handlingHistoryLine);
        });
      }

      // Add invoice lines
      if (xmlInvoice.invoicelines?.purchaseinvoiceline) {
        forceArray(xmlInvoice.invoicelines.purchaseinvoiceline).forEach((xmlInvoiceLine: any) => {
          const invoiceLine: GetPurchaseInvoiceLine = {
            netvisorKey: parseInt(xmlInvoiceLine.netvisorkey),
            lineSum: parseFloat(xmlInvoiceLine.linesum.replace(',', '.')),
            lineNetSum: parseFloat(xmlInvoiceLine.linenetsum.replace(',', '.')),
            unitPrice: parseFloat(xmlInvoiceLine.unitprice.replace(',', '.')),
            vatPercent: parseFloat(xmlInvoiceLine.vatpercent.replace(',', '.')),
            vatCode: xmlInvoiceLine.vatcode,
            description: xmlInvoiceLine.description || undefined,
            unit: xmlInvoiceLine.unit || undefined,
            orderedAmount: parseFloat(xmlInvoiceLine.orderedamount.replace(',', '.')) || 0,
            deliveredAmount: parseFloat(xmlInvoiceLine.deliveredamount.replace(',', '.')) || 0,
            productCode: xmlInvoiceLine.productcode || undefined,
            discountPercentage: parseFloat(xmlInvoiceLine.discountpercentage.replace(',', '.')) || 0,
            productName: xmlInvoiceLine.productname || undefined,
            accountingSuggestionBookkeepingAccount: xmlInvoiceLine.accountingsuggestionbookkeepingaccount || undefined,
            accountingSuggestionBookkeepingAccountNetvisorKey:
              parseInt(xmlInvoiceLine.accountingsuggestionbookkeepingaccountnetvisorkey) || undefined
          };
          if (xmlInvoiceLine.purchaseinvoicelinedimensions?.dimension) {
            invoiceLine.purchaseInvoiceLineDimensions = { dimension: [] };
            forceArray(xmlInvoiceLine.purchaseinvoicelinedimensions.dimension).forEach((xmlDimension: any) => {
              invoiceLine.purchaseInvoiceLineDimensions!.dimension.push({
                dimensionName: xmlDimension.dimensionname,
                dimensionNameNetvisorKey: parseInt(xmlDimension.dimensionnamenetvisorkey),
                dimensionDetailName: xmlDimension.dimensiondetailname,
                dimensionDetailNameNetvisorKey: parseInt(xmlDimension.dimensiondetailnamenetvisorkey)
              });
            });
          }
          purchaseInvoice.invoiceLines.purchaseInvoiceLine.push(invoiceLine);
        });
      }
      purchaseInvoices.push(purchaseInvoice);
    });

    return purchaseInvoices;
  }

  /**
   * Get purchase order list from Netvisor
   * @example await purchaseOrderList({ limitBeginDate: '2023-09-01', limitOrderStatus: 'proposal' });
   */
  async purchaseOrderList(params?: PurchaseOrderListItem): Promise<PurchaseOrderListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('purchaseorderlist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const purchaseOrderList: PurchaseOrderListItem[] = [];
    // Add items to return array
    if (xmlObject.purchaseorderlist?.purchaseorder) {
      forceArray(xmlObject.purchaseorderlist.purchaseorder).forEach((xmlOrder: any) => {
        purchaseOrderList.push({
          netvisorKey: parseInt(xmlOrder.netvisorkey),
          orderNumber: xmlOrder.ordernumber,
          orderStatus: xmlOrder.orderstatus,
          orderDate: xmlOrder.orderdate,
          vendorName: xmlOrder.vendorname,
          amount: parseFloat(xmlOrder.amount.replace(',', '.')),
          uri: xmlOrder.uri
        });
      });
    }

    return purchaseOrderList;
  }

  /**
   * Get purchase order(s) from Netvisor
   * @example await getPurchaseOrder({ netvisorKey: 123 });
   */
  async getPurchaseOrder(params: GetPurchaseOrderParameters): Promise<GetPurchaseOrder[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getpurchaseorder.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const purchaseOrders: GetPurchaseOrder[] = [];
    // Parse orders from xml object
    let xmlOrders = [];
    if (xmlObject.purchaseorder) {
      xmlOrders = forceArray(xmlObject.purchaseorder);
    } else if (xmlObject.purchaseorders?.purchaseorder) {
      xmlOrders = forceArray(xmlObject.purchaseorders.purchaseorder);
    }
    // Add items to return array
    xmlOrders.forEach((xmlOrder: any) => {
      const purchaseOrder: GetPurchaseOrder = {
        netvisorKey: parseInt(xmlOrder.netvisorkey),
        orderNumber: xmlOrder.ordernumber,
        orderStatus: xmlOrder.orderstatus,
        orderDate: xmlOrder.orderdate,
        vendorName: xmlOrder.vendorname,
        vendorAddressLine: xmlOrder.vendoraddressline,
        vendorPostNumber: xmlOrder.vendorpostnumber,
        vendorCity: xmlOrder.vendorcity,
        vendorCountry: xmlOrder.vendorcountry,
        deliveryTerm: xmlOrder.deliveryterm,
        deliveryMethod: xmlOrder.deliverymethod,
        deliveryName: xmlOrder.deliveryname,
        deliveryAddressLine: xmlOrder.deliveryaddressline,
        deliveryPostNumber: xmlOrder.deliverypostnumber,
        deliveryCity: xmlOrder.deliverycity,
        deliveryCountry: xmlOrder.deliverycountry,
        privateComment: xmlOrder.privatecomment,
        comment: xmlOrder.comment,
        ourReference: xmlOrder.ourreference,
        paymentTerm: xmlOrder.paymentterm,
        amount: {
          value: parseFloat(xmlOrder.amount.value.replace(',', '.')),
          attr: xmlOrder.amount.attr
        },
        purchaseOrderLines: {}
      };

      // Add purchase order lines
      if (xmlOrder.purchaseorderlines?.purchaseorderproductdeliverygroup) {
        purchaseOrder.purchaseOrderLines.purchaseOrderProductDeliveryGroup = [];
        forceArray(xmlOrder.purchaseorderlines.purchaseorderproductdeliverygroup).forEach((xmlProductDeliveryGroup: any) => {
          purchaseOrder.purchaseOrderLines.purchaseOrderProductDeliveryGroup!.push({
            netvisorKey: parseInt(xmlProductDeliveryGroup.netvisorkey),
            productCode: xmlProductDeliveryGroup.productcode || '',
            productName: xmlProductDeliveryGroup.productname || '',
            vendorProductCode: xmlProductDeliveryGroup.vendorproductcode || '',
            orderedAmount: parseFloat(xmlProductDeliveryGroup.orderedamount.replace(',', '.')) || 0,
            unitPrice: parseFloat(xmlProductDeliveryGroup.unitprice.replace(',', '.')) || 0,
            vatPercent: parseFloat(xmlProductDeliveryGroup.vatpercent.replace(',', '.')) || 0,
            lineSum: parseFloat(xmlProductDeliveryGroup.linesum.replace(',', '.')) || 0,
            freightRate: parseFloat(xmlProductDeliveryGroup.freightrate?.replace(',', '.')) || 0
          });
        });
      }
      if (xmlOrder.purchaseorderlines?.purchaseorderproductline) {
        purchaseOrder.purchaseOrderLines.purchaseOrderProductLine = [];
        forceArray(xmlOrder.purchaseorderlines.purchaseorderproductline).forEach((xmlProductLine: any) => {
          const purchaseOrderLine: GetPurchaseOrderProductLine = {
            netvisorKey: parseInt(xmlProductLine.netvisorkey),
            productCode: xmlProductLine.productcode || '',
            productName: xmlProductLine.productname || '',
            vendorProductCode: xmlProductLine.vendorproductcode || '',
            orderedAmount: parseFloat(xmlProductLine.orderedamount.replace(',', '.')) || 0,
            deliveredAmount: parseFloat(xmlProductLine.deliveredamount.replace(',', '.')) || 0,
            unitPrice: parseFloat(xmlProductLine.unitprice.replace(',', '.')) || 0,
            vatPercent: parseFloat(xmlProductLine.vatpercent.replace(',', '.')) || 0,
            lineSum: parseFloat(xmlProductLine.linesum.replace(',', '.')) || 0,
            freightRate: parseFloat(xmlProductLine.freightrate?.replace(',', '.')) || 0,
            deliveryDate: {
              value: xmlProductLine.deliverydate.value || '',
              attr: { format: 'ansi' }
            }
          };
          // Add optional attributes
          if (xmlProductLine.productquality) {
            purchaseOrderLine.productQuality = {
              attr: { netvisorkey: parseInt(xmlProductLine.productquality.attr.netvisorkey) },
              qualityDescription: xmlProductLine.productquality.qualitydescription,
              qualityDeviation: xmlProductLine.productquality.qualitydeviation.toLowerCase() === 'true' ? true : false
            };
          }
          if (xmlProductLine.inventoryplace) {
            purchaseOrderLine.inventoryPlace = {
              value: xmlProductLine.inventoryplace.value,
              attr: { netvisorkey: parseInt(xmlProductLine.inventoryplace.attr.netvisorkey) }
            };
          }
          if (xmlProductLine.accountingsuggestion) purchaseOrderLine.accountingSuggestion = xmlProductLine.accountingsuggestion;
          if (xmlProductLine.dimension) {
            purchaseOrderLine.dimension = [];
            forceArray(xmlProductLine.dimension).forEach((xmlDimension: any) => {
              purchaseOrderLine.dimension!.push({
                dimensionName: xmlDimension.dimensionname,
                dimensionItem: xmlDimension.dimensionitem
              });
            });
          }
          if (xmlProductLine.linkedpurchaseinvoicelines) {
            purchaseOrderLine.linkedPurchaseInvoiceLines = { purchaseInvoice: [] };
            forceArray(xmlProductLine.linkedpurchaseinvoicelines.purchaseinvoice).forEach((xmlLinkedInvoiceLine: any) => {
              const linkedInvoiceLine: LinkedInvoiceLine = {
                netvisorKey: parseInt(xmlLinkedInvoiceLine.netvisorkey),
                invoiceNumber: xmlLinkedInvoiceLine.invoicenumber,
                purchaseInvoiceProductLines: []
              };
              if (xmlLinkedInvoiceLine.purchaseinvoiceproductlines) {
                forceArray(xmlLinkedInvoiceLine.purchaseinvoiceproductlines).forEach((xmlInvoiceProductLine: any) => {
                  linkedInvoiceLine.purchaseInvoiceProductLines.push({
                    netvisorKey: parseInt(xmlInvoiceProductLine.netvisorkey)
                  });
                });
              }
              purchaseOrderLine.linkedPurchaseInvoiceLines!.purchaseInvoice.push(linkedInvoiceLine);
            });
          }
          // Push the purchase order line to the main return object
          purchaseOrder.purchaseOrderLines.purchaseOrderProductLine!.push(purchaseOrderLine);
        });
      }
      if (xmlOrder.purchaseorderlines?.purchaseordercommentline) {
        purchaseOrder.purchaseOrderLines.purchaseOrderCommentLine = [];
        forceArray(xmlOrder.purchaseorderlines.purchaseordercommentline).forEach((xmlCommentLine: any) => {
          purchaseOrder.purchaseOrderLines.purchaseOrderCommentLine!.push({
            netvisorKey: parseInt(xmlCommentLine.netvisorkey),
            comment: xmlCommentLine.comment || ''
          });
        });
      }
      if (xmlOrder.purchaseorderlines?.linkedpurchaseinvoices) {
        purchaseOrder.purchaseOrderLines.linkedPurchaseInvoices = { purchaseInvoice: [] };
        forceArray(xmlOrder.purchaseorderlines.linkedpurchaseinvoices.purchaseinvoice).forEach((xmlLinkedInvoice: any) => {
          purchaseOrder.purchaseOrderLines.linkedPurchaseInvoices!.purchaseInvoice.push({
            netvisorKey: parseInt(xmlLinkedInvoice.netvisorkey),
            invoiceNumber: xmlLinkedInvoice.invoicenumber,
            uri: xmlLinkedInvoice.uri
          });
        });
      }
      purchaseOrders.push(purchaseOrder);
    });
    return purchaseOrders;
  }

  /**
   * Create or edit a purchase order in Netvisor. If you are creating a new purchase order, check required fields from Netvisor's documentation.
   * @example await purchaseOrder(purchaseOrder, { method: 'add' });
   * @returns the added purchase order's netvisor key
   */
  async purchaseOrder(purchaseOrder: PurchaseOrder, params: PurchaseOrderParameters): Promise<string> {
    const response = await this._client.post('purchaseorder.nv', buildXml({ root: { purchaseOrder: purchaseOrder } }), params);
    if (params.method === 'add') return parseXml(response).replies.inserteddataidentifier;
    return params.id?.toString() || '';
  }
}
