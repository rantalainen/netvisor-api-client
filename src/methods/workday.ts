import { NetvisorApiClient } from '..';
import { NetvisorMethod, forceArray, parseXml, buildXml } from './_method';
import { TripExpense, Workday } from '../interfaces/workday';

export class NetvisorWorkdayMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Create a new trip expense to Netvisor
   * @example await tripExpense(tripExpenseData);
   * @returns the added trip expense's netvisor key
   */
  async tripExpense(expense: TripExpense): Promise<string> {
    const response = await this._client.post('tripexpense.nv', buildXml({ root: { tripexpense: expense } }));
    return parseXml(response).replies.inserteddataidentifier;
  }

  /**
   * Create a new work day record to Netvisor
   * @example await workday(workdayData);
   */
  async workday(record: Workday): Promise<void> {
    await this._client.post('workday.nv', buildXml({ root: { workday: record } }));
  }
}
