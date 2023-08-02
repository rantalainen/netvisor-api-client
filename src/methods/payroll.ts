import { NetvisorApiClient } from '..';
import { NetvisorMethod, forceArray, parseXml, buildXml } from './_method';
import { PayrollPeriodCollector } from '../interfaces/payroll';

export class NetvisorPayrollMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Create a new payroll period collector to Netvisor
   * @example await payrollPeriodCollector(collectorData);
   */
  async payrollPeriodCollector(collector: PayrollPeriodCollector): Promise<void> {
    await this._client.post('payrollperiodcollector.nv', buildXml({ root: { payrollperiodcollector: collector } }));
  }
}
