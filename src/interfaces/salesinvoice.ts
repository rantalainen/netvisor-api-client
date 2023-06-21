// Types

type InvoiceStatusParameter = 'open' | 'overdue' | 'paid' | 'unsent' | 'creditloss' | 'rejected';
type InvoiceSubStatusParameter = 'open' | 'overdue' | 'reminded' | 'requested' | 'collected';
type SalesInvoiceListInvoiceStatus =
  | 'open'
  | 'paid'
  | 'unsent'
  | 'creditloss'
  | 'rejected'
  | 'archived'
  | 'undelivered'
  | 'delivered'
  | 'billed';
type SalesInvoiceInvoiceStatus =
  | 'open'
  | 'paid'
  | 'unsent'
  | 'overdue'
  | 'reminded'
  | 'requested'
  | 'collected'
  | 'creditloss'
  | 'rejected'
  | 'archived'
  | 'undelivered'
  | 'delivered'
  | 'billed';
type VatCode =
  | 'NONE'
  | 'KOOS'
  | 'EUOS'
  | 'EUUO'
  | 'EUPO'
  | '100'
  | 'KOMY'
  | 'EUMY'
  | 'EUUM'
  | 'EUPM312'
  | 'EUPM309'
  | 'MUUL'
  | 'EVTO'
  | 'EVPO'
  | 'RAMY'
  | 'RAOS'
  | 'EVRO';

/*
 * RESOURCE
 * salesinvoicelist.nv
 */
export interface SalesInvoiceListParameters {
  /** Ei arvoa kun haetaan myyntilaskulistaa ja 'preinvoice' kun haetaan tilauslistaa */
  listType?: '' | 'preinvoice';
  /** Rajaa kaikki laskut/tilaukset jälkeen annetun tietokannan id:n */
  invoicesAboveNetvisorKey?: number;
  /** Laskut/tilaukset, joissa päivämäärä suurempi tai yhtäsuuri (YYYY-MM-DD) */
  beginInvoiceDate?: string;
  /** Laskut/tilaukset, joissa päivämäärä pienempi tai yhtäsuuri (YYYY-MM-DD) */
  endInvoiceDate?: string;
  /** Rajaa listan lasku-/tilausnumerolla */
  invoiceNumber?: string;
  /** Rajaa listan laskun tilalla (ei käytetä tilauksiin). Hakee sekä InvoiceStatus kentästä että SubStatus attribuutista. */
  invoiceStatus?: InvoiceStatusParameter | InvoiceSubStatusParameter;
  /** Hakee myyntilaskut, joita on muutettu annetun päivämäärän jälkeen */
  lastModifiedStart?: string;
  /** Hakee myyntilaskut, joita on muutettu ennen annettua päivämäärää */
  lastModifiedEnd?: string;
  /** Rajaa myyntilaskuerässä tuodut myyntilaskut annetun erä ID:n mukaisesti. */
  salesInvoiceBatchId?: number;
  /** Rajaa listan asiakaskoodilla */
  customerCode?: string;
  /** Rajaa listan asiakkaan Netvisor ID:llä */
  customerNetvisorKey?: number;
  /** Rajaa listaan myyntilaskut aputoiminimen nimellä */
  secondName?: string;
  /** Rajaa listaan myyntilaskut aputoiminimen Netvisor ID:llä */
  secondNameNetvisorKey?: number;
  /** Rajaa listaan myyntilaskut asiakkaan laskutusmaan mukaan */
  invoicingCustomerCountryCode?: string;
  /** Arvolla 1 palautetaan laskun sisäinen kommentti. Arvolla 2 palautetaan laskun valuuttasumma ja avoin valuuttasumma. Arvolla 3 palautetaan kaikki edellämainitut. */
  replyOption?: 1 | 2 | 3;
}

export interface SalesInvoiceListItem {
  netvisorKey: string;
  invoiceNumber: string;
  invoiceDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  invoiceStatus: {
    value: SalesInvoiceListInvoiceStatus;
    attr: { substatus?: InvoiceSubStatusParameter; isincollection: number };
  };
  customerCode: string;
  customerName: string;
  referenceNumber: string;
  invoiceSum: number;
  openSum: number;
  uri: string;
  additionalInformation?: SalesInvoiceListItemAdditionalInformation;
}

export interface SalesInvoiceListItemAdditionalInformation {
  privateComment?: string;
  invoiceCurrencySum?: {
    value: number;
    attr: { currencycode: string; type: 'ISO-4217' };
  };
  openCurrencySum?: {
    value: number;
    attr: { currencycode: string; type: 'ISO-4217' };
  };
}

/*
 * RESOURCE
 * getsalesinvoice.nv
 */
export interface GetSalesInvoiceParameters {
  /** Haettavan laskun Netvisor tunnus (Huom. ei pakollinen jos annetaan parametrille netvisorkeylist arvo; vaihtoehtoinen parametri netvisorkeylist:in kanssa) */
  netvisorKey: number;
  /** Jos ei anneta parametria, tekee saman kuin jos antaa pdfimage=lastsentprintservice
  palauttaa mahdollisen tulostuspalveluun lähetetyn pdf:n LastSentInvoicePDFBase64Data-kentässä
  palauttaa laskun kuvan pdf-muodossa LastSentInvoicePDFBase64Data-kentässä
  ei palauta mitään */
  pdfImage?: 'lastsentprintservice' | 'pdf' | 'nopdf';
  /** Palauttaa myyntilaskullakin näkyvän tulostus/lähetyshistoriatiedon ProcessHistory-elementissä */
  showProcessHistory?: 0 | 1;
  /** Palauttaa kaikki laskun liitteet Base64-enkoodattuna */
  includeAttachments?: 0 | 1;
  /** Palauttaa InvoiceLine aggregaatin sisään laskun kommenttirivit */
  showCommentLines?: 0 | 1;
  /** Palauttaa yhdessä pyynnössä täydet tiedot kaikista halutuista laskuista, max. 500 ID:tä (Huom. vaihtoehtoinen parametrin netvisorkey kanssa, vain toinen annetaan) */
  netvisorKeyList?: string;
  /** Palauttaa myyntilaskua noudettaessa laskulle liittyvät tilaukset. */
  includeDocuments?: 0 | 1;
}

export interface GetSalesInvoiceSalesInvoice {
  salesInvoiceNetvisorKey: string;
  salesInvoiceNumber: string;
  salesInvoiceDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  salesInvoiceEventDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  salesInvoiceValueDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  salesInvoiceDeliveryDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  salesInvoiceDueDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  salesInvoiceReferencenumber: string;
  salesInvoiceAmount: {
    value: number;
    attr: { iso4217currencycode?: string; currencyrate?: number };
  };
  foreignCurrencyAmount?: number;
  salesInvoiceCollectionCost?: number;
  sellerIdentifier: {
    value: string;
    attr: { type: 'name' };
  };
  invoiceStatus: {
    value: string;
    attr: { status: SalesInvoiceInvoiceStatus };
  };
  invoiceVoucher?: {
    value: string;
    attr: { netvisorKey: string };
  };
  salesInvoiceFreeTextBeforeLines: string;
  salesInvoiceFreeTextAfterLines: string;
  salesInvoiceOurReference: string;
  salesInvoiceYourReference: string;
  salesInvoicePrivateComment: string;
  salesInvoiceAgreementIdentifier: string;
  invoicingCustomerCode: string;
  invoicingCustomerName: string;
  invoicingCustomerNameExtension: string;
  invoicingCustomerNetvisorKey: string;
  invoicingCustomerOrganizationIdentifier: string;
  invoicingCustomerAddressline: string;
  invoicingCustomerAdditionalAddressLine: string;
  invoicingCustomerPostnumber: string;
  invoicingCustomerTown: string;
  invoicingCustomerCountryCode: {
    value: string;
    attr: { 'ISO-3166': string };
  };
  matchPartialPaymentsByDefault: string;
  deliveryAddressName: string;
  deliveryAddressLine: string;
  deliveryAddressPostnumber: string;
  deliveryAddressTown: string;
  deliveryAddressCountryCode: string;
  deliveryMethod: string;
  deliveryTerm: string;
  paymentTermNetDays: string;
  paymentTermCashDiscountDays: string;
  paymentTermCashDiscount: {
    value: string;
    attr: { type: 'percentage' };
  };
  waybillIdentifier: string;
  deliveryToCustomerDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  deliveryToCustomerWeek?: string;
  taxHandlingClause: {
    value: string;
    attr: { netvisorKey: string };
  };
  deliveryOfficeIdentifier: string;
  contactPersonNetvisorKey?: number;
  contactPersonFirstName?: string;
  contactPersonLastName?: string;
  contactPersonPhoneNumber?: string;
  contactPersonEmail?: string;
  lastSentInvoicePDFBase64Data?: string;
  creditedInvoiceNetvisorKey?: number;
  invoiceLines: {
    invoiceLine: {
      salesInvoiceProductLine?: GetSalesInvoiceSalesInvoiceProductLine[];
      salesInvoiceCommentLine?: SalesInvoiceCommentLine[];
    };
  };
  salesInvoiceAttachments?: {
    salesInvoiceAttachment: GetSalesInvoiceAttachment[];
  };
  documents?: {
    salesOrder: {
      netvisorKey: number;
      orderNumber: number;
    }[];
  };
}

export interface GetSalesInvoiceSalesInvoiceProductLine {
  netvisorKey: string;
  productIdentifier: {
    value: string;
    attr: { type: 'customer' };
  };
  productName: string;
  productNetvisorKey: string;
  productUnitPrice: number;
  productPurchasePrice: number;
  productVatPercentage: {
    value: string;
    attr: { vatcode: VatCode };
  };
  productPrimaryEanCode: string;
  productSecondaryEanCode: string;
  salesInvoiceProductLineQuantity: number;
  salesInvoiceProductLineUnit: string;
  salesInvoiceProductLineDeliveryDate?: string;
  salesInvoiceProductLineDiscountPercentage: number;
  salesInvoiceProductLineFreeText: string;
  salesInvoiceProductLineVatSum: number;
  salesInvoiceProductLineSum: number;
  salesInvoiceProductLineInventoryID?: number;
  salesInvoiceProductLineInventoryName?: string;
  accountingAccountSuggestion: number;
  accountingAccountSuggestionAccountNumber: number;
  dimension?: SalesInvoiceDimension[];
  provisionPercentage: number;
}

export interface SalesInvoiceCommentLine {
  comment: string;
}

interface SalesInvoiceDimension {
  dimensionName: string;
  dimensionItem: string;
}

interface GetSalesInvoiceAttachment {
  mimeType: string;
  attachmentDescription: string;
  fileName: string;
  documentData: string;
}

/*
 * RESOURCE
 * salesinvoice.nv
 */

export interface SalesInvoiceParameters {
  method: 'add' | 'edit';
  id?: number;
}

export interface SalesInvoice {
  /** If not given, Netvisor will create invoice number automatically */
  salesInvoiceNumber?: number;
  salesInvoiceDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  salesInvoiceEventDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  /** paymentTerm, paymentTermNetDays or salesInvoiceDueDate must be given */
  salesInvoiceDueDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  salesInvoiceValueDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  salesInvoiceDeliveryDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  /** Date or weeknumber (2020-W12) */
  salesInvoiceDeliveryToCustomerDate?: {
    value: string;
    attr: {
      format: 'ansi';
      type: 'date' | 'weeknumber';
    };
  };
  salesInvoiceWaybillIdentifier?: string;
  /** Can be used ONLY on sales order */
  salesInvoiceProductPackagePallet?: {
    value: number;
    attr: {
      type: string;
      amount?: string;
    };
  };
  salesInvoiceReferenceNumber?: string;
  /** If given, this amount will be used and total sum will NOT be calculated from product lines */
  salesInvoiceAmount: {
    value: number;
    attr: {
      iso4217CurrencyCode?: string;
      currencyRate?: string;
      priceType?: 'netvisor' | 'customer';
    };
  };
  sellerIdentifier?: {
    value: string;
    attr: { type: 'netvisor' | 'customer' };
  };
  sellerName?: string;
  invoiceType?: 'invoice' | 'order' | 'invoicedraft';
  /** Draft: ''; Invoice: 'open' | 'unsent'; Order: 'delivered' | 'undelivered'*/
  salesInvoiceStatus: {
    value: '' | 'open' | 'unsent' | 'delivered' | 'undelivered';
    attr: { type: 'netvisor' };
  };
  salesInvoiceFreeTextBeforeLines?: string;
  salesInvoiceFreeTextAfterLines?: string;
  salesInvoiceOurReference?: string;
  salesInvoiceYourReference?: string;
  salesInvoicePrivateComment?: string;
  invoicingCustomerIdentifier: {
    value: string;
    attr: {
      type: 'netvisor' | 'customer' | 'organizationunitnumber';
      contactpersonid?: string;
    };
  };
  invoicingCustomerName?: string;
  invoicingCustomerNameExtension?: string;
  invoicingCustomerAddressLine?: string;
  invoicingCustomerAdditionalAddressLine?: string;
  invoicingCustomerPostNumber?: string;
  invoicingCustomerTown?: string;
  invoicingCustomerCountryCode?: {
    value: string;
    attr?: { type: 'ISO-3166' };
  };
  /** If type attribute is used, new office will be created to Netvisor. If new office is created, all the delivery information must be given. */
  officeIdentifier?:
    | {
        value: string;
        attr: { type: 'automatic' };
      }
    | string;
  deliveryOffice?: {
    value: string;
    attr: { type: 'Customer' | 'Netvisor' };
  };
  deliveryAddressName?: string;
  deliveryAddressLine?: string;
  deliveryAddressPostNumber?: string;
  deliveryAddressTown?: string;
  deliveryAddressCountryCode?: {
    value: string;
    attr: { type: 'ISO-3166' };
  };
  deliveryMethod?: string;
  deliveryTerm?: string;
  salesInvoiceTaxHandlingType?: string;
  /** paymentTerm, paymentTermNetDays or salesInvoiceDueDate must be given */
  paymentTerm?: {
    value: number;
    attr: { type: 'netvisor' | 'customerdefault' | 'companydefault' | 'default' };
  };
  /** paymentTerm, paymentTermNetDays or salesInvoiceDueDate must be given */
  paymentTermNetDays?: number;
  paymentTermCashDiscountDays?: number;
  paymentTermCashDiscount?: {
    value: number;
    attr: { type: 'percentage' };
  };
  expectPartialPayments?: 0 | 1;
  overrideVoucherSalesReceivablesAccountNumber?: number;
  salesInvoiceAgreementIdentifier?: string;
  /** type 'netvisor': '1' | '2'; type 'customer': 'Lasku + tilisiirto' | 'Lasku' */
  printChannelFormat?: {
    value: '1' | '2' | 'Lasku + tilisiirto' | 'Lasku';
    attr: {
      type: 'netvisor' | 'customer';
      secondName?: string;
    };
  };
  overrideRateOfOverdue?: number;
  orderNumber?: string;
  proposedAccount?: {
    value: number;
    attr: { type: 'customer' };
  };
  accountDimensionText?: string;
  /** Only positive values and 0 allowed */
  collectionCost?: number;
  isThirdPartySales?: 0 | 1;
  invoicelines: {
    invoiceLine: {
      salesInvoiceProductLine?: SalesInvoiceProductLine[];
      salesInvoiceCommentLine?: SalesInvoiceCommentLine[];
      salesInvoiceSubLine?: SalesInvoiceSubLine[];
    };
  };
  invoiceVoucherLines?: {
    voucherLine: SalesInvoiceVoucherLine[];
  };
  accuralRule?: SalesInvoiceAccrualRule;
  salesInvoiceAttachments: {
    salesInvoiceAttachment: SalesInvoiceAttachment[];
  };
  customTags: {
    tag: Tag[];
  };
}

export interface SalesInvoiceProductLine {
  productIdentifier: {
    value: string;
    attr: { type: 'customer' | 'netvisor' | 'primaryeancode' | 'secondaryeancode' };
  };
  productName?: string;
  productUnitPrice: {
    value: number;
    attr: { type: 'net' | 'gross' };
  };
  productUnitPriceAttr: { type: string };
  productUnitPurchasePrice?: {
    value: number;
    attr: { type: 'net' };
  };
  productVatPercentage: {
    value: number;
    attr: { vatcode: VatCode };
  };
  salesInvoiceProductLineQuantity: number;
  /** Give either just a number value OR only the attribute without number value (then customer's own discount percent is used) */
  salesInvoiceProductLineDiscountPercentage?:
    | {
        attr: { type: 'netvisor' };
      }
    | number;
  salesInvoiceProductLineFreetext?: string;
  /** If used, remember to give salesInvoiceProductLineSum as well or else these values will NOT be used */
  salesInvoiceProductLineVatSum?: number;
  /** If used, remember to give salesInvoiceProductLineVatSum as well or else these values will NOT be used */
  salesInvoiceProductLineSum?: number;
  salesInvoiceProductLineInventoryId?: number;
  accountingAccountSuggestion?: number;
  dimension?: SalesInvoiceDimension[];
  provisionPercentage?: number;
  accrualrule?: SalesInvoiceAccrualRule;
  productUnitName?: string;
  deliveryDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  orderNumber?: string;
  proposedAccount?: {
    value: number;
    attr: { type: 'customer' };
  };
  accountDimensionText?: string;
}

export interface SalesInvoiceSubLine {
  sublineArticleIdentifier?: string;
  sublineArticleName: string;
  sublineDescription?: string;
  sublineUnitCode?: string;
  sublineUnitPrice?: number;
  sublineDeliveredQuantity?: number;
  sublineDiscountPercent?: number;
  sublineVatPercent?: number;
  sublineSum?: number;
  sublineVatSum?: number;
}

export interface SalesInvoiceVoucherLine {
  lineSum: {
    value: number;
    attr: { type: 'net' | 'gross' };
  };
  description?: string;
  accountNumber: string;
  vatPercent: {
    value: number;
    attr: { vatcode: VatCode };
  };
  dimension?: SalesInvoiceDimension[];
}

export interface SalesInvoiceAccrualRule {
  startmonth: number;
  startyear: number;
  endmonth?: number;
  endyear?: number;
  divisioncurvename?: string;
}

export interface SalesInvoiceAttachment {
  mimeType: string;
  attachmentDescription: string;
  fileName: string;
  documentData: {
    value: string;
    attr: { type: 'finvoice' | 'pdf' };
  };
  /** Do not give this property if documenData type is 'finvoice' */
  printbydefault?: 0 | 1;
}

export interface Tag {
  tagName: string;
  tagValue: {
    value: string;
    attr: { type: 'float' | 'date' | 'text' | 'enum' };
  };
}
