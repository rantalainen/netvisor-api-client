export interface IPurchaseInvoice {
  purchaseinvoice: {
    invoicenumber: number;
    invoicedate: { '@': { format: string }; '#': string };
    invoicesource: string;
    valuedate: { '@': { format: string }; '#': string };
    eventdate: { '@': { format: string }; '#': string };
    duedate: { '@': { format: string }; '#': string };
    purchaseinvoiceonround: { '@': { type: string }; '#': string };
    vendorcode: string;
    vendorname: string;
    vendoraddressline: string;
    vendorpostnumber: string;
    vendorcity: string;
    vendorcountry: string;
    amount?: number;
    accountnumber?: string;
    organizationidentifier?: string;
    bankreferencenumber: string;
    ourreference?: string;
    yourreference?: string;
    currencycode: string;
    readyforaccounting?: string;
    primaryvendormatchtype: string;
    purchaseinvoicelines: {
      purchaseinvoiceline: IPurchaseInvoiceLine[];
    };
  };
}

export interface IPurchaseInvoiceLine {
  productcode: any;
  productname: string;
  deliveredamount: number;
  unitprice: number;
  vatpercent: number;
  linesum: { '@': { type: string }; '#': number };
  description?: string;
  accountingsuggestion?: number;
}

export interface IPurchaseInvoiceOutput {
  purchaseInvoiceNetvisorKey: string;
  purchaseInvoiceNumber: string;
  purchaseInvoiceDate: string;
  purchaseInvoiceEventDate: string;
  purchaseInvoiceDeliveryDate: string;
  purchaseInvoiceDueDate: string;
  purchaseInvoiceValueDate: string;
  purchaseInvoiceReferencenumber: string;
  purchaseInvoiceVendorBankAccountNumber: string;
  isPurchaseInvoiceVendorBankAccountDeleted: string;
  isPurchaseInvoiceVendorBankAccountFromSEPARegion: string;
  purchaseInvoiceAmount: string;
  purchaseInvoicePaidAmount: string;
  foreignCurrencyAmount: string;
  foreignCurrencyNameID: string;
  invoiceStatus: string;
  approvalStatus: string;
  purchaseInvoiceOurReference: string;
  purchaseInvoiceYourReference: string;
  purchaseInvoiceDescription: string;
  vendorNetvisorKey: string;
  vendorOrganizationIdentifier: string;
  vendorCode: string;
  vendorName: string;
  vendorAddressline: string;
  vendorPostnumber: string;
  vendorTown: string;
  vendorCountry: string;
  fingerprint: string;
  voucherID: string;
  isAccounted: string;
  attachments: any;
  invoiceLines: IPurchaseInvoiceLineOutput[];
  linkedPurchaseOrders: ILinkedPurchaseOrder[];

  [key: string]: any;
}

export interface IPurchaseInvoiceLineOutput {
  NetvisorKey: string;
  LineSum: string;
  LineNetSum: string;
  UnitPrice: string;
  VatPercent: string;
  VatCode: string;
  Description: string;
  Unit: string;
  OrderedAmount: string;
  PurchasePrice: string;
  DeliveredAmount: string;
  ProductCode: string;
  DiscountPercentage: string;
  ProductName: string;
  AccountingSuggestionBookkeepingAccountNetvisorKey: string;
  AccountingSuggestionBookkeepingAccount: string;

  [key: string]: any;
}

export interface ILinkedPurchaseOrder {
  OrderNumber: string;
  NetvisorKey: string;

  [key: string]: any;
}

export interface IPurchaseOrderOutput {
  netvisorKey: string;
  orderNumber: string;
  orderStatus: string;
  orderDate: string;
  vendorName: string;
  vendorAddressLine: string;
  vendorPostNumber: string;
  VendorCity: string;
  vendorCountry: string;
  deliveryTerm: string;
  deliveryMethod: string;
  deliveryName: string;
  deliveryAddressLine: string;
  deliveryPostNumber: string;
  deliveryCity: string;
  deliveryCountry: string;
  privateComment: string;
  comment: string;
  ourReference: string;
  paymentTerm: string;
  currencyCode: string;
  amount: string;
  purchaseOrderLines: IPurchaseOrderLineOutput[];
  linkedPurchaseInvoices: ILinkedPurchaseInvoice[];

  [key: string]: any;
}

export interface IPurchaseOrderLineOutput {
  NetvisorKey: string;
  ProductCode: string;
  ProductName: string;
  VendorProductCode: string;
  VendorProductName: string;
  OrderedAmount: string;
  DeliveredAmount: string;
  UnitPrice: string;
  VatPercent: string;
  LineSum: string;
  VatCode: string;

  [key: string]: any;
}

export interface ILinkedPurchaseInvoice {
  InvoiceNumber: string;
  NetvisorKey: string;
  [key: string]: any;
}
