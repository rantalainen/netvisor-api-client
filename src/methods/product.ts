import { NetvisorApiClient } from "..";
import { NetvisorMethod } from "./_method";
import * as xml2js from 'xml2js';
const js2xmlparser = require('js2xmlparser');

export interface IProductDataSet {
  Product: {
    productbaseinformation: {
      productcode: any;
      productgroup: string;
      name: string;
      unitprice: {
        '@': {type: 'net'}, '#': number
      };
      unit: string;
      isactive: number;
      issalesproduct: number;
      inventoryenabled: number;
    }, 
    productbookkeepingdetails: {
      defaultvatpercentage: number;
    }
  }
};

export interface IProductList {
  NetvisorKey: [ string ];
  ProductCode: [ string ];
  Name: [ string ];
  UnitPrice: [ string ];
  UnitGrossPrice: [ string ];
  ProductGroupID: [ string ];
  ProductGroupDescription: [ string ];
  Uri: [ string ];
  param? : any
};

export class NetvisorProductMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
    //https://integration.netvisor.fi/product.nv?method=add
    this._endpointUri = 'product.nv';
  }

  /**
   * Save one product as product object
   * @param dataset as IProductDataSet
   */
   async saveProductByDataSet(dataset: IProductDataSet, method: string, key?: string ) {

    const xml = js2xmlparser.parse('Root', dataset);
    
    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>",""), {method: method, id: key});
  }

  /**
   * Get product list from Netvisor
   * @param productCode to narrow search with product code
   */
   async getProducts(productCode?: string) : Promise<any> {

    const productsRaw = await this._client.get('productlist.nv', {keyword: productCode});

    var parser = new xml2js.Parser();

    const productList: Array<IProductList> = await new Promise(async (resolve, reject) => {
      parser.parseString(productsRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json: any = xmlResult.Root.ProductList[0].Product;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    const products = [];
    for (const item of productList) {
      const product = {
        netvisorKey: item.NetvisorKey[0],
        productCode: item.ProductCode[0],
        name: item.Name[0]
      }
      products.push(product);
    }

    return products;
  }

}