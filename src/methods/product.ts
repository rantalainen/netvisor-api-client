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
        '@': {type: string}, '#': number
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
  ProductGroup: [ string ];
  UnitPrice: [ string ];
  UnitGrossPrice: [ string ];
  ProductGroupID: [ string ];
  ProductGroupDescription: [ string ];
  Uri: [ string ];
  param? : any
};

export interface IInventory {
  warehouseevent: {
    description: string;
    reference: any;
    warehouseeventlines: {
      warehouseeventline: Array<IWarehouseEvent>;
    }
  }
}

export interface IWarehouseEvent {
  eventtype: { '@': {type: string}, '#': string };
  product: { '@': {type: string}, '#': any };
  inventoryplace?: string;
  description: string;
  quantity: number;
  unitprice: number;
  valuedate: string;
  status: string;
}

export interface IInventoryList {
  NetvisorKey: [ string ];
  Code: [ string ];
  TotalAmount: [ string ];
  Name: [ string ];
  param? : any
};

export class NetvisorProductMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

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
   * @param params to narrow search with keyword or netvisor key
   */
   async getProducts(params?: any) : Promise<any> {

    const productsRaw = await this._client.get('productlist.nv', params);

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
        name: item.Name[0],
        group: item.ProductGroupDescription[0]
      }
      products.push(product);
    }

    return products;
  }


  async getInventory() {
    const inventoryRaw = await this._client.get('inventorybywarehouse.nv');

    var parser = new xml2js.Parser();

    const inventoryList: Array<IInventoryList> = await new Promise(async (resolve, reject) => {
      parser.parseString(inventoryRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json: any = xmlResult.Root.InventoryByWarehouse[0].Product;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    const inventory = [];
    for (const item of inventoryList) {
      const product = {
        netvisorKey: item.NetvisorKey[0],
        productCode: item.Code[0],
        name: item.Name[0],
        totalAmount: item.TotalAmount[0]
      }
      inventory.push(product);
    }

    return inventory;
  }

  /**
   * Save inventory using inventory dataset
   * @param dataset as IInventory
   */
   async saveInventoryByDataSet(dataset: IInventory) {

    const xml = js2xmlparser.parse('Root', dataset);
    
    return await this._client.post('warehouseevent.nv', xml.replace("<?xml version='1.0'?>",""));
  }

  /**
   * Save inventory with xml
   * @param fileContents xml data in string
   */
   async saveInventoryByXmlData(fileContents: string) : Promise<any> {
    
    return await this._client.post('warehouseevent.nv', fileContents);
  }

}