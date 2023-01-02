import { NetvisorApiClient } from '..';
import fs from 'fs';
import { NetvisorMethod } from './_method';
import * as js2xmlparser from 'js2xmlparser';
import { IAccountingBudgetDataSet } from '../intefaces/budget';

type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex';

export class NetvisorBudgetMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'accountingbudget.nv';
  }

  /**
   * Save one months budget / account to Netvisor (with dimensions)
   * @param dataset as IAccountingBudgetDataSet as budget object
   */
  async saveAccountingBudgetByDataSet(dataset: IAccountingBudgetDataSet) {
    const xml = js2xmlparser.parse('Root', dataset);

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''));
  }

  /**
   * Save one months budget / account to Netvisor (without dimensions)
   * @param dataset as budget object
   */
  async saveAccountBudgetByDataSet(dataset: any) {
    const xml = js2xmlparser.parse('Root', dataset);

    return await this._client.post('accountingbudgetaccountbudget.nv', xml.replace("<?xml version='1.0'?>", ''));
  }

  /**
   * Save one months budget / file to Netvisor (with dimensions)
   * @param filePath
   */
  async saveAccountingBudgetByXmlFilePath(filePath: string, encoding: BufferEncoding = 'latin1') {
    const fileContents = fs.readFileSync(filePath, { encoding });

    return await this._client.post(this._endpointUri, fileContents);
  }
}
