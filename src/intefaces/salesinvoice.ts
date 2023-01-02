export interface ISalesPayment {
  salespayment: {
    sum: { '@': { currency: string }; '#': string };
    paymentdate: string;
    targetidentifier: { '@': { type: string; targettype: string }; '#': string };
    sourcename: string;
    paymentmethod: { '@': { type: string }; '#': string };
    salespaymentvoucherlines?: { voucherline: IVoucherLine[] };
  };
}

export interface IVoucherLine {
  linesum: { '@': { type: string }; '#': string };
  description?: string;
  accountnumber: string;
  vatpercent: { '@': { vatcode: string }; '#': number | string };
  dimension?: IDimension[];
}

interface IDimension {
  dimensionname: string;
  dimensionitem: string;
}

export interface ISalesInvoice {
  salesInvoice: {
    salesInvoiceNumber?: number;
    salesInvoiceDate: { '@': { format: string }; '#': string };
    salesInvoiceEventDate?: { '@': { format: string }; '#': string };
    salesInvoiceDueDate?: { '@': { format: string }; '#': string };
    salesInvoiceReferenceNumber?: string;
    salesInvoiceAmount?: string | { '@': { iso4217currencycode: string }; '#': string };
    invoiceType: string;
    salesInvoiceStatus: { '@': { type: string }; '#': string };
    invoicingCustomeridentifier: { '@': { type: string }; '#': string };
    invoicingCustomerName?: string;
    invoicingCustomerAddressLine?: string;
    invoicingCustomerPostNumber?: string;
    invoicingCustomerTown?: string;
    invoicingCustomerCountryCode?: { '@': { type: string }; '#': string };
    invoiceLines: {
      invoiceLine: Array<ISalesInvoiceProductLine>;
    };
    [key: string]: any;
  };
}

export interface ISalesInvoiceProductLine {
  salesInvoiceProductLine?: {
    productIdentifier: { '@': { type: string }; '#': string };
    productName: string;
    productunitPrice?: { '@': { type: string }; '#': number | string };
    productVatPercentage?: { '@': { vatcode: string }; '#': number | string };
    salesInvoiceProductLineQuantity?: number | string;
    [key: string]: any;
  };
  salesinvoicecommentline?: {
    comment: string;
  };
}
