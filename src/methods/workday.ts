import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as js2xmlparser from 'js2xmlparser';
import { IPayrollPeriodRecord, IWorkday } from '../intefaces/workday';

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
