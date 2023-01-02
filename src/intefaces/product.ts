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

export interface IProduct {
  ProductBaseInformation: {
    NetvisorKey: string;
    ProductCode: string;
    Name: string;
    UnitPrice: string;
    UnitGrossPrice: string;
    [key: string]: any;
  };
  ProductBookKeepingDetails: {
    DefaultVatPercent: string;
    DefaultDomesticAccountNumber: string;
    DefaultEuAccountNumber: string;
    DefaultOutsideEUAccountNumber: string;
  };
  ProductInventoryDetails?: {
    InventoryAmount: string;
    InventoryMidPrice: string;
    InventoryValue: string;
    [key: string]: any;
  };
}
