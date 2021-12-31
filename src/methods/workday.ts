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
      starttimeofday: 'HH:MM';
      endtimeofday: 'HH:MM';
      breaktime?: { '@': { type: string }; '#': number };
      collectorratio?: { '@': { type: string }; '#': number };
      acceptancestatus: AcceptanceStatus;
      description: string;
      dimension?: Dimensions;
    };
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
}
