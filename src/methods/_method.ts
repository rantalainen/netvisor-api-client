import { NetvisorApiClient } from "..";
import fs from 'fs';

export type STRING_ANSI = 'ansi';

export class NetvisorMethod {
  protected _client!: NetvisorApiClient;
  protected _endpointUri!: string;

  constructor(client: NetvisorApiClient) {
    Object.defineProperty(this, '_client', {
      enumerable: false,
      value: client
    });
  }

  /**
   * Save xml batch to Netvisor (e.g. invoice, voucher)
   * @param fileContents xml data in string
   */
   async saveByXmlData(fileContents: string) : Promise<any> {

    return await this._client.post(this._endpointUri, fileContents);
  }

  /**
   * Save xml batch to Netvisor (e.g. invoice, voucher)
   * @param filePath path to xml file
   */
   async saveByXmlFilePath(filePath: string, encoding: BufferEncoding = 'latin1') {
    const fileContents = fs.readFileSync(filePath, { encoding });

    return await this._client.post(this._endpointUri, fileContents);
  }

}