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
  startDate: string;
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
