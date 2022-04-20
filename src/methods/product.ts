import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as xml2js from 'xml2js';
import * as js2xmlparser from 'js2xmlparser';

export interface IProductDataSet {
  Product: {
    productbaseinformation: {
      productcode: any;
      productgroup: string;
      name: string;
      unitprice: {
        '@': { type: string };
        '#': number;
      };
      unit: string;
      isactive: number;
      issalesproduct: number;
      inventoryenabled: number;
    };
    productbookkeepingdetails: {
      defaultvatpercentage: number;
    };
  };
}

export interface IProductList {
  NetvisorKey: [string];
  ProductCode: [string];
  Name: [string];
  ProductGroup: [string];
  UnitPrice: [string];
  UnitGrossPrice: [string];
  ProductGroupID: [string];
  ProductGroupDescription: [string];
  Uri: [string];
  param?: any;
}

export interface IInventory {
  warehouseevent: {
    description: string;
    reference: any;
    warehouseeventlines: {
      warehouseeventline: Array<IWarehouseEvent>;
    };
  };
}

export interface IWarehouseEvent {
  eventtype: { '@': { type: string }; '#': string };
  product: { '@': { type: string }; '#': any };
  inventoryplace?: string;
  description: string;
  quantity: number;
  unitprice: number;
  valuedate: string;
  status: string;
}

export interface IInventoryList {
  NetvisorKey: [string];
  Code: [string];
  TotalAmount: [string];
  Name: [string];
  param?: any;
}

export interface IPriceGroup {
  PriceGroupNetvisorKey: string;
  PriceGroupName: string;
  PriceGroupNetPrice: string;
  PriceGroupGrossPrice: string;
}

export interface IExtendedProduct {
  NetvisorKey: string;
  ProductCode: string;
  ProductPriceInformation: {
    DefaultNetPrice: string;
    DefaultGrossPrice: string;
    DefaultVatPercent: string;
    PriceMargin: string;
    ProvisionPercentage: string;
    PriceGroups: Array<IPriceGroup>;
  };
  ProductAccountInformation?: {
    DefaultDomesticAccountNumber: string;
    DefaultEuAccountNumber: string;
    DefaultOutsideEUAccountNumber: string;
    DefaultInventoryAccountNumber: string;
  };
}

export class NetvisorProductMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'product.nv';
  }

  /**
   * Save one product as product object
   * @param dataset as IProductDataSet
   * @param params as parameters with {method: add}
   * if editing product {method: add/edit, id: netvisorkey}
   */
  async saveProductByDataSet(dataset: IProductDataSet, params: any) {
    const xml = js2xmlparser.parse('Root', dataset);

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''), params);
  }

  /**
   * Get product list from Netvisor
   * @param params to narrow search with keyword or netvisor key
   */
  async getProducts(params?: any): Promise<any> {
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

    // productList returns undefined if no products in search criteria
    if (!productList) {
      return [];
    }

    const products = [];
    for (const item of productList) {
      const product = {
        netvisorKey: item.NetvisorKey[0],
        productCode: item.ProductCode[0],
        name: item.Name[0],
        unitPrice: item.UnitPrice[0],
        unitGrossPrice: item.UnitGrossPrice[0],
        group: item.ProductGroupDescription[0]
      };
      products.push(product);
    }

    return products;
  }

  async getExtendedProducts(params?: any): Promise<IExtendedProduct[]> {
    const productsRaw = await this._client.get('extendedproductlist.nv', params);

    var parser = new xml2js.Parser();

    const productList: Array<any> = await new Promise(async (resolve, reject) => {
      parser.parseString(productsRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json: any = xmlResult.Root.Products[0].Product;

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    // productList returns undefined if no products in search criteria
    if (!productList) {
      return [];
    }

    const products = [];
    for (const item of productList) {
      const priceGroups = [];
      if (!!item.ProductPriceInformation[0].PriceGroups[0].PriceGroup) {
        for (const pg of item.ProductPriceInformation[0].PriceGroups[0].PriceGroup) {
          const pgObj = {
            PriceGroupNetvisorKey: pg.NetvisorKey[0],
            PriceGroupName: pg.PriceGroupName[0],
            PriceGroupNetPrice: pg.NetPrice[0],
            PriceGroupGrossPrice: pg.GrossPrice[0]
          };
          priceGroups.push(pgObj);
        }
      }

      const product: IExtendedProduct = {
        NetvisorKey: item.NetvisorKey[0],
        ProductCode: item.ProductCodes[0].ProductCode[0],
        ProductPriceInformation: {
          DefaultNetPrice: item.ProductPriceInformation[0].DefaultNetPrice[0],
          DefaultGrossPrice: item.ProductPriceInformation[0].DefaultGrossPrice[0],
          DefaultVatPercent: item.ProductPriceInformation[0].Vat[0].Percentage[0],
          PriceMargin: item.ProductPriceInformation[0].PriceMargin[0],
          ProvisionPercentage: item.ProductPriceInformation[0].ProvisionPercentage[0],
          PriceGroups: priceGroups
        }
      };
      if (item.ProductAccountInformation) {
        product.ProductAccountInformation = {
          DefaultDomesticAccountNumber: item.ProductAccountInformation[0].DefaultDomesticAccountNumber[0],
          DefaultEuAccountNumber: item.ProductAccountInformation[0].DefaultEuAccountNumber[0],
          DefaultOutsideEUAccountNumber: item.ProductAccountInformation[0].DefaultOutsideEUAccountNumber[0],
          DefaultInventoryAccountNumber: item.ProductAccountInformation[0].DefaultInventoryAccountNumber[0]
        };
      }
      products.push(product);
    }

    return products;
  }

  async getProductByNetvisorKey(netvisorKey: string) {
    const productRaw = await this._client.get('getproduct.nv', { id: netvisorKey });

    var parser = new xml2js.Parser();

    const product: any = await new Promise(async (resolve, reject) => {
      parser.parseString(productRaw, (error: string, xmlResult: any) => {
        if (error) return reject(error);

        const status: any = xmlResult.Root.ResponseStatus[0].Status;
        const json: any = xmlResult.Root.Product[0];

        if (status[0] === 'OK') {
          resolve(json);
        } else {
          reject(status[1]);
        }
      });
    });

    // Clean product object by removing arrays from key values
    const productOut = {
      ProductBaseInformation: {
        NetvisorKey: product.ProductBaseInformation[0].NetvisorKey[0],
        ProductCode: product.ProductBaseInformation[0].ProductCode[0],
        ProductGroup: product.ProductBaseInformation[0].ProductGroup[0],
        Name: product.ProductBaseInformation[0].Name[0],
        Description: product.ProductBaseInformation[0].Description[0],
        UnitPrice: product.ProductBaseInformation[0].UnitPrice[0],
        UnitGrossPrice: product.ProductBaseInformation[0].UnitGrossPrice[0],
        Unit: product.ProductBaseInformation[0].Unit[0],
        UnitWeight: product.ProductBaseInformation[0].UnitWeight[0],
        KaukevaProductCode: product.ProductBaseInformation[0].KaukevaProductCode[0],
        PurchasePrice: product.ProductBaseInformation[0].PurchasePrice[0],
        TariffHeading: product.ProductBaseInformation[0].TariffHeading[0],
        ComissionPercentage: product.ProductBaseInformation[0].ComissionPercentage[0],
        IsActive: product.ProductBaseInformation[0].IsActive[0],
        IsSalesProduct: product.ProductBaseInformation[0].IsSalesProduct[0],
        IsStorageProduct: product.ProductBaseInformation[0].IsStorageProduct[0],
        CountryOfOrigin: product.ProductBaseInformation[0].CountryOfOrigin[0]
      },
      ProductBookKeepingDetails: {
        DefaultVatPercent: product.ProductBookKeepingDetails[0].DefaultVatPercent[0],
        DefaultDomesticAccountNumber: product.ProductBookKeepingDetails[0].DefaultDomesticAccountNumber[0],
        DefaultEuAccountNumber: product.ProductBookKeepingDetails[0].DefaultEuAccountNumber[0],
        DefaultOutsideEUAccountNumber: product.ProductBookKeepingDetails[0].DefaultOutsideEUAccountNumber[0]
      },
      ProductInventoryDetails: {
        InventoryAmount: product.ProductInventoryDetails[0].InventoryAmount[0],
        InventoryMidPrice: product.ProductInventoryDetails[0].InventoryMidPrice[0],
        InventoryValue: product.ProductInventoryDetails[0].InventoryValue[0],
        InventoryReservedAmount: product.ProductInventoryDetails[0].InventoryReservedAmount[0],
        InventoryOrderedAmount: product.ProductInventoryDetails[0].InventoryOrderedAmount[0],
        InventoryAccountNumber: product.ProductInventoryDetails[0].InventoryAccountNumber[0]
      }
    };

    return productOut;
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
      };
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

    return await this._client.post('warehouseevent.nv', xml.replace("<?xml version='1.0'?>", ''));
  }

  /**
   * Save inventory with xml
   * @param fileContents xml data in string
   */
  async saveInventoryByXmlData(fileContents: string): Promise<any> {
    return await this._client.post('warehouseevent.nv', fileContents);
  }
}
