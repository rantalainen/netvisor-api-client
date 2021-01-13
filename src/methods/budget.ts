import { NetvisorApiClient } from "..";
import fs from 'fs';
import path from 'path';
import * as xml2js from 'xml2js';

export class NetvisorBudgetMethods {
  private _client!: NetvisorApiClient;
  private _endpointUri: string;

  constructor(client: NetvisorApiClient) {
    Object.defineProperty(this, '_client', {
      enumerable: false,
      value: client
    });

    this._endpointUri = 'accountingbudget.nv';
  }


  /**
   * Save one months budget / file to Netvisor
   * @param filePath Filepath
   */
  async saveBudgetByXmlFilePath(filePath: string, encoding: BufferEncoding = 'latin1') {
    const xmlParser = new xml2js.Parser();

    const fileContents = fs.readFileSync(filePath, { encoding });

    const xmlTiedot = xmlParser.parseString(fileContents, function (error: string, xmlResult: any) {
      console.log(xmlResult);
      return xmlResult;
    });
    

    //dimensionlist.nv

    //return await this._client.post(this._endpointUri, fileContents);
  }

}