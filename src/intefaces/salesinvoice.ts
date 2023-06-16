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

// Resource: salesinvoicelist.nv

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
  replyOption?: number;
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
    attr: { subStatus?: InvoiceSubStatusParameter; isInCollection: number };
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
    attr: { currencyCode: string; type: string };
  };
  openCurrencySum?: {
    value: number;
    attr: { currencyCode: string; type: string };
  };
}

// Resource: getsalesinvoice.nv / getorder.nv

export interface GetSalesInvoiceParameters {
  /** Haettavan laskun Netvisor tunnus (Huom. ei pakollinen jos annetaan parametrille netvisorkeylist arvo; vaihtoehtoinen parametri netvisorkeylist:in kanssa) */
  netvisorKey: number;
  /** Jos ei anneta parametria, tekee saman kuin jos antaa pdfimage=lastsentprintservice
  palauttaa mahdollisen tulostuspalveluun lähetetyn pdf:n LastSentInvoicePDFBase64Data-kentässä
  palauttaa laskun kuvan pdf-muodossa LastSentInvoicePDFBase64Data-kentässä
  ei palauta mitään */
  pdfImage?: 'lastsentprintservice' | 'pdf' | 'nopdf';
  /** Palauttaa myyntilaskullakin näkyvän tulostus/lähetyshistoriatiedon ProcessHistory-elementissä */
  showProcessHistory?: number;
  /** Palauttaa kaikki laskun liitteet Base64-enkoodattuna */
  includeAttachments?: number;
  /** Palauttaa InvoiceLine aggregaatin sisään laskun kommenttirivit */
  showCommentLines?: number;
  /** Palauttaa yhdessä pyynnössä täydet tiedot kaikista halutuista laskuista, max. 500 ID:tä (Huom. vaihtoehtoinen parametrin netvisorkey kanssa, vain toinen annetaan) */
  netvisorKeyList?: string;
  /** Palauttaa myyntilaskua noudettaessa laskulle liittyvät tilaukset. Palauttaa myyntitilausta noudettaessa tilaukselle liittyvät laskut */
  includeDocuments?: number;
}

export interface SalesInvoice {
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
  salesInvoiceCollectionCost: number;
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
  invoicingCustomerCountryCode: string;
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
  deliveryToCustomerWeek: string;
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
    invoiceLine: InvoiceLine[];
  };
  salesInvoiceAttachments?: {
    salesInvoiceAttachment: SalesInvoiceAttachment[];
  };
  documents: {
    salesOrder: {
      netvisorKey: number;
      orderNumber: number;
    }[];
  };
}

// Pitäisikö tämä vain ottaa kokonaan pois välistä? Vai miten tämä oikein menee?
interface InvoiceLine {
  SalesInvoiceProductLine: (SalesInvoiceProductLine | SalesInvoiceCommentLine)[];
}

interface SalesInvoiceProductLine {
  netvisorKey: string;
  productIdentifier: string;
  productNetvisorKey: string;
  productName: string;
  productUnitPrice: number;
  productPurchasePrice: number;
  productVatPercentage: string;
  productPrimaryEanCode: string;
  productSecondaryEanCode: string;
  salesInvoiceProductLineQuantity: number;
  salesInvoiceProductLineUnit: string;
  salesInvoiceProductLineDeliveryDate?: {
    value: string;
    attr: { format: string };
  };
  salesInvoiceProductLineDiscountPercentage: number;
  salesInvoiceProductLineFreeText: string;
  salesInvoiceProductLineVatSum: number;
  salesInvoiceProductLineSum: number;
  salesInvoiceProductLineInventoryID?: number;
  salesInvoiceProductLineInventoryName?: string;
  accountingAccountSuggestion: {
    value: number;
    attr: { accountingAccountSuggestionAccountNumber: number };
  };
  dimension?: {
    dimensionName: string;
    dimensionItem: string;
  }[];
  provisionPercentage: number;
}

interface SalesInvoiceCommentLine {
  comment: string;
}

interface SalesInvoiceAttachment {
  mimeType: string;
  attachmentDescription: string;
  fileName: string;
  documentData: string;
}
