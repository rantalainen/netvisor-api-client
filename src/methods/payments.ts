import { NetvisorApiClient } from "..";
import fs from 'fs';
import path from 'path';

export class NetvisorPaymentMethods {
  private _client!: NetvisorApiClient;
  private _endpointUri: string;

  constructor(client: NetvisorApiClient) {
    Object.defineProperty(this, '_client', {
      enumerable: false,
      value: client
    });

    this._endpointUri = 'payment.nv';
  }


  /**
   * Save external bank transfers to Netvisor
   * @param filePath Filepath
   */
  async saveBankTransfersByXmlFilePath(filePath: string, encoding: BufferEncoding = 'latin1') {
    const fileContents = fs.readFileSync(filePath, { encoding });

    return await this._client.post(this._endpointUri, fileContents);
  }

}