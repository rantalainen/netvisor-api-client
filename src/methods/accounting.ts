import { NetvisorApiClient } from "..";
import fs from 'fs';
import path from 'path';

/*export interface INetvisorAccountingMethodsOptions {
  [propName: string]: string;
}*/

export class NetvisorAccountingMethods {
  private _client!: NetvisorApiClient;
  private _endpointUri: string;

  constructor(client: NetvisorApiClient) {
    Object.defineProperty(this, '_client', {
      enumerable: false,
      value: client
    });

    this._endpointUri = 'accounting.nv';
  }


  /**
   * Save vouchers to Netvisor accounting
   * @param filePath Filepath
   */
  async saveVouchersByXmlFilePath(filePath: string, encoding: BufferEncoding = 'latin1') {
    const fileContents = fs.readFileSync(filePath, { encoding });

    return await this._client.post(this._endpointUri, fileContents);
  }

}