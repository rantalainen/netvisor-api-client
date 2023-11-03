type VoucherStatus = 'valid' | 'invalidated' | 'deleted';

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
 * accountingledger.nv
 */

export interface AccountingLedgerParameters {
  /** Format yyyy-MM-DD */
  startDate: string;
  /** Format yyyy-MM-DD */
  endDate: string;
  accountNumberStart?: number;
  accountNumberEnd?: number;
  changedSince?: string;
  lastModifiedStart?: string;
  lastModifiedEnd?: string;
  showGenerator?: 1;
  voucherStatus?: 1 | 2 | 3;
}

export interface AccountingLedgerVoucher {
  status: VoucherStatus;
  netvisorKey: number;
  voucherDate: string;
  voucherNumber: number;
  voucherDescription: string;
  voucherClass: string;
  linkedSourceNetvisorKey: {
    value: number;
    attr: { type: 'purchaseinvoice' | 'salesinvoice' };
  };
  voucherNetvisorUri: string;
  voucherLine: AccountingLedgerVoucherLine[];
}

export interface AccountingLedgerVoucherLine {
  netvisorKey: number;
  lineSum: number;
  description: string;
  accountNumber: number;
  vatPercent: number;
  vatCode: VatCode;
  accountDimension?: {
    value: string;
    attr: { netvisorkey: number };
  };
  dimension?: {
    dimensionName: string;
    dimensionItem: string;
  }[];
}

/*
 * RESOURCE
 * accounting.nv
 */

export interface AccountingVoucher {
  calculationMode: 'net' | 'gross';
  voucherDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  number?: number;
  description?: string;
  voucherClass: string;
  checked?: boolean;
  voucherLine: AccountingVoucherLine[];
  voucherAttachments?: {
    voucherAttachment: {
      mimeType: string;
      attachmentDescription: string;
      fileName: string;
      documentData: string;
    }[];
  };
}

export interface AccountingVoucherLine {
  lineSum: {
    value: number;
    attr: { type: 'net' | 'gross' };
  };
  description?: string;
  accountNumber: number;
  vatPercent: {
    value: number;
    attr?: { vatCode?: VatCode };
  };
  accountDimension?: {
    value: string;
    attr: { type: 'netvisorkey' | 'name' };
  };
  dimension?: {
    dimensionName: string;
    dimensionItem: string;
  }[];
}

/*
 * RESOURCE
 * accountlist.nv
 */

export interface AccountList {
  companyDefaultAccounts: {
    tradePayables: number;
    purchaseVatReceivable: number;
    roundingOffDifference: number;
    vatPayable: number;
    taxAccount: number;
    advancePayments: number;
    salesReceivables: number;
    salesVatDebt: number;
    inventory: number;
    salesDiscount: number;
    salesExchangeRateDifferences: number;
    collection: number;
    purchaseDiscounts: number;
    purchasesExchangeRateDifferences: number;
    purchaseInvoiceAccrual: number;
    salesInvoiceAccrual: number;
    purchaseDomesticDefault: number;
    purchaseEUDefault: number;
    purchaseOutsideEuDefault: number;
    salesDomesticDefault: number;
    salesEUDefault: number;
    salesOutsideEUDefault: number;
  };
  accounts: {
    account: AccountListAccount[];
  };
}

export interface AccountListAccount {
  netvisorKey: number;
  number: string;
  name: string;
  foreignName?: {
    value: string;
    attr: { 'iso-3166': 'fi' | 'en' | 'se' };
  }[];
  accountType: 'account' | 'accountgroup';
  fatherNetvisorKey: number;
  isActive: boolean;
  isCumulative: boolean;
  sort: number;
  endSort: number;
  isNaturalNegative: boolean;
}

/*
 * RESOURCE
 * vouchertypelist.nv
 */

export interface VoucherTypeList {
  defaultVoucherTypes: {
    salesInvoices: DefaultVoucherType;
    salesInvoicePayments: DefaultVoucherType;
    purchaseInvoices: DefaultVoucherType;
    purchaseInvoicePayments: DefaultVoucherType;
    otherSystemGeneratedVouchers: DefaultVoucherType;
    bankStatementViewVouchers: DefaultVoucherType;
    accruals: DefaultVoucherType;
  };
  voucherTypes: {
    voucherType: VoucherType[];
  };
}

interface DefaultVoucherType {
  netvisorKey: number;
}

export interface VoucherType {
  netvisorKey: number;
  abbreviation: string;
  name: string;
  foreignName?: {
    value: string;
    attr: { 'ISO-639-1': 'fi' | 'en' | 'sv' };
  }[];
}
