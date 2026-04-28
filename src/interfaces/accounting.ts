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
  netvisorKey?: number;
  /** Comma separated list of voucher Netvisor keys. E.g. '1,2,3' */
  netvisorKeyList?: string;
  /** Format yyyy-MM-DD */
  startDate?: string;
  /** Format yyyy-MM-DD */
  endDate?: string;
  accountNumberStart?: number;
  accountNumberEnd?: number;
  changedSince?: string;
  lastModifiedStart?: string;
  lastModifiedEnd?: string;
  showGenerator?: 1;
  voucherStatus?: 1 | 2 | 3;
  /** Use the Netvisor key of the voucher type to filter vouchers */
  voucherType?: number;
  includeTransactionHistory?: 0 | 1;
  includeAttachmentsMetadata?: 0 | 1;
  includeTransactionAllocations?: 0 | 1;
}

export interface AccountingLedgerVoucher {
  status: VoucherStatus;
  netvisorKey: number;
  voucherDate: string;
  voucherNumber: number;
  voucherDescription: string;
  voucherClass: {
    value: string;
    attr: { netvisorKey: number };
  };
  linkedSourceNetvisorKey: {
    value: number;
    attr: { type: 'purchaseinvoice' | 'salesinvoice' };
  };
  voucherNetvisorUri: string;
  voucherLine: AccountingLedgerVoucherLine[];
  transactionHistory?: TransactionHistory;
}

export type TransactionHistory = {
  transaction: {
    comment?: string;
    timeStamp?: string;
    format?: {
      value: string;
      attr: { format: 'ansi' };
    };
    editor?: string;
  }[];
};

type TransactionAllocation = {
  attr: {
    type: 'allocatedby' | 'allocatedto';
  };
  voucherLineNetvisorKey: number;
  voucherNetvisorKey: number;
};

export interface AccountingLedgerVoucherLine {
  netvisorKey: number;
  lineSum: number;
  description: string;
  accountNumber: number;
  vatPercent: number;
  vatCode: VatCode;
  transactionFollowUpStatus?: 'Open' | 'Closed';
  transactionAllocations?: TransactionAllocation[];
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
  comment?: string;
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
 * accountingledger.nv
 */

export interface AccountingEditVoucher extends AccountingVoucher {
  netvisorKey: number;
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

/*
 * RESOURCE
 * accountbalance.nv
 */

export interface AccountBalanceParameters {
  /** Netvisorkey of the account. If not given then all accounts are fetched. */
  netvisorKey?: number;
  /** Comma separated list of account netvisorkeys. If not given then all accounts are fetched. */
  netvisorKeyList?: string;
  /** Fetch account balances from date interval or separate dates depending of the intervaltype parameter. Dates are comma separated. Example: 2024-09-01,2024-09-30 */
  balanceDates: string;
  /** If not given or 0 then balances are fetched from separate dates defined by the balancedates parameter
Otherwise balances are fetched in defined steps inside the balancedates interval. The balances of the first and last day are always fetched.
not given or 0 = No Interval (separate dates)
1 = Day
2 = Week
3 = Month
4 = Year */
  intervalType?: 0 | 1 | 2 | 3 | 4;
}

export interface AccountBalance {
  attr: {
    date: string;
  };
  debet: number;
  kredit: number;
  balance: number;
}

export interface AccountBalanceAccount {
  accountBalances: {
    account: {
      attr: { netvisorkey: number };
      accountbalance: AccountBalance[];
    };
  }[];
}

/*
 * RESOURCE
 * accountingbudget.nv
 */

export interface AccountingBudgetDimension {
  dimensionname: string;
  dimensionitem: {
    value: string;
    attr?: { fatherid?: number };
  };
}

export interface AccountingBudgetCombination {
  combinationsum: number;
  dimension: AccountingBudgetDimension | AccountingBudgetDimension[];
}

export interface AccountingBudget {
  ratio: {
    value: string;
    attr?: { type?: 'account' | 'ratio' };
  };
  sum: number;
  year: number;
  month: number;
  version: string;
  vatclass?: number;
  combinations?: {
    combination: AccountingBudgetCombination | AccountingBudgetCombination[];
  };
}

/*
 * RESOURCE
 * accountingbudgetaccountbudget.nv
 */

export interface AccountingBudgetAccountBudgetMonth {
  sum: number;
  vat: number;
  month: number;
  year: number;
}

export interface AccountingBudgetAccountIdentifier {
  accountnumber: number;
  accountname: string;
  accountgroup: number;
}

export interface AccountingBudgetLockedDimension {
  dimensionname: string;
  dimensionitemname: string;
  budgetaccount:
    | {
        accountidentifier: AccountingBudgetAccountIdentifier;
        budgetmonth: AccountingBudgetAccountBudgetMonth | AccountingBudgetAccountBudgetMonth[];
      }
    | {
        accountidentifier: AccountingBudgetAccountIdentifier;
        budgetmonth: AccountingBudgetAccountBudgetMonth | AccountingBudgetAccountBudgetMonth[];
      }[];
}

export interface AccountingBudgetAccountBudget {
  method: 'change' | 'replace';
  lockeddimension?: AccountingBudgetLockedDimension | AccountingBudgetLockedDimension[];
}

/*
 * RESOURCE
 * accountingbudgetaccountlist.nv
 */

export interface AccountingBudgetAccountListParameters {
  /** Year must be between 1950-2050 */
  year: number;
}

export interface AccountingBudgetAccount {
  netvisorKey: number;
  name: string;
  number: string;
  group: string;
  type: string;
}

/*
 * RESOURCE
 * settransactionallocation.nv
 */

export interface TransactionAllocationItem {
  attr: { action: 'attach' | 'detach' };
  allocationFromVoucherLineNetvisorKey: number;
  allocationToVoucherLineNetvisorKey: number;
}

export interface SetTransactionAllocation {
  transactionAllocations: {
    transactionAllocation: TransactionAllocationItem[];
  };
}
