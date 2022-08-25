import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as js2xmlparser from 'js2xmlparser';

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

export class NetvisorWorkdayMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'workday.nv';
  }

  /**
   * Save workday hours per employee
   * @param dataset as IWorkday
   */
  async saveWorkdayByDataSet(dataset: IWorkday) {
    const xml = js2xmlparser.parse('Root', dataset);

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''));
  }

  /**
   * Save payroll period record
   * @param dataset as IPayrollPeriodRecord
   */
  async savePayrollPeriodRecordByDataSet(dataset: IPayrollPeriodRecord) {
    const xml = js2xmlparser.parse('Root', { payrollperiodcollector: dataset });

    return await this._client.post('payrollperiodcollector.nv', xml.replace("<?xml version='1.0'?>", ''));
  }
}
