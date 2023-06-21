// Resource: salespaymentlist.nv

interface SalespaymentList {
  salesPayment: SalesPayment[];
}

interface SalesPayment {
  netvisorKey: number;
  name: string;
  date: string;
  sum: number;
  referenceNumber: string;
  foreignCurrencyAmount: number;
  invoiceNumber: number;
  paymentAccountName: string;
  voucherID: number;
  lastModifiedTimestamp: number;
  paymentAccountNumber: string;
  paymentSource: number;
  bankStatus: string;
  bankStatusErrorDescription?: {
    value: string;
    attr: { code: string };
  };
}
