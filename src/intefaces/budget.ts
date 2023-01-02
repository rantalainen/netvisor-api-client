type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex';

export interface IAccountingBudgetDataSet {
  AccountingBudget: {
    /** Ratio is expressed with object to achieve type "account" attribute */
    Ratio: {
      '@': { type: 'account' };
      '#': number;
    };
    Sum: number;
    Year: number;
    Month: number;
    Version: string;
    VatClass: number;
    Combinations?: {
      Combination?: [
        {
          CombinationSum: number;
          Dimension?: [
            {
              DimensionName: string;
              DimensionItem: string;
            }
          ];
        }
      ];
    };
  };
}
