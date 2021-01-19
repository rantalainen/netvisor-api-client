import { NetvisorApiClient } from "..";
import fs from 'fs';
import path from 'path';
import { NetvisorMethods } from "./_method";
import { DOMParser } from 'xmldom';
var js2xmlparser = require('js2xmlparser');

export interface IAccountingBudgetDataSet {
  AccountingBudget:{
    /** Ratio is expressed with object to achieve type "account" attribute */
    Ratio: {
      '@': {type: 'account'}, '#': number
    };
    Sum: number;
    Year: number;
    Month: number;
    Version: string;
    VatClass: number;
    Combinations?:{
      Combination?:[
        CombinationSum: number,
        Dimension?:[
          {
            DimensionName: string;
            DimensionItem: string;
          }
        ]
      ]
    }
  }
}


export class NetvisorBudgetMethods extends NetvisorMethods {

  constructor(client: NetvisorApiClient) {
    super(client);
    
    this._endpointUri = 'accountingbudget.nv';
  }

  /**
   * Save one months budget / account to Netvisor
   * @param dataset as IAccountingBudgetDataSet as budget object
   */
  async saveBudgetByDataSet(dataset: IAccountingBudgetDataSet) {
    
    console.log(dataset);

    const xml = js2xmlparser.parse('Root', dataset);
    console.log(xml.replace("<?xml version='1.0'?>",""));
    
    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>",""));
  }


  /**
   * Save one months budget / file to Netvisor
   * @param filePath Filepath
   */
  async saveBudgetByXmlFilePath(filePath: string, encoding: BufferEncoding = 'latin1') {
    const fileContents = fs.readFileSync(filePath, { encoding });

    console.log(fileContents);

    //Create a new DOMParser object.
    const domParser = new DOMParser();
    
    //Parse the XML string into an XMLDocument object
    var xmlDocument = domParser.parseFromString(fileContents);

    // Get dimensions elements from xmlDocument
    const dimensions = xmlDocument.getElementsByTagName('DimensionItem');

    // Get dimensionlist from Netvisor
    //const dimensions = await this._client.get('dimensionlist.nv');

    // Loop budget dimensions and compare to Netvisor dimensions
    for (const item of Array.from(dimensions)) {
      const dimensionValue = item?.firstChild?.nodeValue;

      if (dimensionValue) {
        console.log(dimensionValue);
      }  
    }

    //return await this._client.post(this._endpointUri, fileContents);
  }

}

