/*
 * RESOURCE
 * payrollperiodcollector.nv
 */

export interface PayrollPeriodCollector {
  date: {
    value: string;
    attr: { format: 'ansi' };
  };
  employeeIdentifier: {
    value: string;
    attr: { type: 'number' | 'personalidentificationnumber' };
  };
  payrollRatioLine: {
    amount: number;
    payrollRatio: {
      value: number;
      attr: { type: 'number' };
    };
    dimension?: {
      dimensionName: string;
      dimensionItem:
        | string
        | {
            value: string;
            attr: { fatherId: number };
          };
    }[];
  }[];
}
