import { NetvisorApiClient } from "..";
import fs from 'fs';
import path from 'path';
import { NetvisorMethod } from "./_method";
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


export class NetvisorBudgetMethod extends NetvisorMethod {

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
   * @param filePath
   * @param checkDimensions true/false to produce errors if diemnsions are not found
   */
  async saveBudgetByXmlFilePath(filePath: string, encoding: BufferEncoding = 'latin1', checkDimensions?: boolean) {
    
    // Get dimensionlist from Netvisor
    const dimensionListNv = await this._client.get('dimensionlist.nv');
    //Create a new DOMParser object.
    const domParser = new DOMParser();
    
    //Parse the XML string into an XMLDocument object
    var xmlDocument = domParser.parseFromString(dimensionListNv);

    // Get dimensions elements from xmlDocument
    const parsedDimensions = xmlDocument.getElementsByTagName('Name');
    
    const nvDimensions = [];
    
    for (const item of Array.from(parsedDimensions)) {
      nvDimensions.push(item?.firstChild?.nodeValue);
    }
    
    
    const fileContents = fs.readFileSync(filePath, { encoding });
    
    //Parse the XML string into an XMLDocument object
    var xmlDocument = domParser.parseFromString(fileContents);

    // Get dimensions elements from xmlDocument
    const dimensions = xmlDocument.getElementsByTagName('DimensionItem');

    // Loop budget dimensions and compare to Netvisor dimensions
    for (const item of Array.from(dimensions)) {
      const dimensionValue = item?.firstChild?.nodeValue;

      if (!nvDimensions.includes(dimensionValue) && checkDimensions) {
        throw new Error (`Dimension value ${dimensionValue} is not found from Netvisor`);
      }  
    }

    return await this._client.post(this._endpointUri, fileContents);
  }

}

