import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as js2xmlparser from 'js2xmlparser';
import { ITripexpense } from '../intefaces/tripexpense';

export class NetvisorTripexpenseMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'tripexpense.nv';
  }

  /**
   * Save workday hours per employee
   * @param dataset as ITripexpense
   */
  async saveTripByDataSet(dataset: ITripexpense) {
    const xml = js2xmlparser.parse('Root', { tripexpense: dataset });

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''));
  }
}
