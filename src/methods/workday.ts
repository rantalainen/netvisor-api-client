import { NetvisorApiClient } from '..';
import { NetvisorMethod, parseXml, buildXml, forceArray } from './_method';
import { GetRecordTypeItem, GetRecordTypeItemName, TripExpense, Workday } from '../interfaces/workday';

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

  async getRecordTypeList(): Promise<GetRecordTypeItem[]> {
    const responseXml = await this._client.get('getRecordTypeList.nv');
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const recordTypes: GetRecordTypeItem[] = [];

    if (xmlObject.recordtypes?.recordtype) {
      forceArray(xmlObject.recordtypes.recordtype).forEach((recordType: any) => {
        recordTypes.push({
          names: {
            name: forceArray(recordType.names.name as GetRecordTypeItemName[])
          },
          netvisorKey: parseInt(recordType.netvisorkey),
          ratioNumber: parseInt(recordType.rationumber),
          characterType: parseInt(recordType.charactertype),
          unitType: parseInt(recordType.unittype)
        });
      });
    }
    return recordTypes;
  }
}
