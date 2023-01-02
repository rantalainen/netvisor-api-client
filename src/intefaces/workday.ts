type WorkdayMethod = 'replace' | 'increment';
type EmployeeIdType = 'number' | 'personalidentificationnumber';
type DimensionHandling = 'none' | 'usedefault';
type AcceptanceStatus = 'confirmed' | 'accepted';
type Dimensions = {
  dimensionname: string;
  dimensionitem: string;
};

export interface IWorkday {
  workday: {
    date: { '@': { format: string; method: WorkdayMethod }; '#': string };
    employeeidentifier: { '@': { type: EmployeeIdType; defaultdimensionhandlingtype: DimensionHandling }; '#': string };
    workdayhour?: {
      hours: number;
      collectorratio: { '@': { type: string }; '#': number };
      acceptancestatus: AcceptanceStatus;
      description: string;
      dimension?: Dimensions;
    };
    workdaytime?: {
      starttimeofday: string;
      endtimeofday: string;
      breaktime?: { '@': { type: string }; '#': number };
      collectorratio?: { '@': { type: string }; '#': number };
      acceptancestatus: AcceptanceStatus;
      description: string;
      dimension?: Dimensions;
    };
  };
}

export interface IPayrollPeriodRecord {
  date: { '@': { format: string }; '#': string };
  employeeidentifier: { '@': { type: EmployeeIdType }; '#': string };
  payrollratioline: {
    amount: number;
    payrollratio: { '@': { type: string }; '#': number };
    dimension?: Dimensions | Dimensions[];
  };
}
