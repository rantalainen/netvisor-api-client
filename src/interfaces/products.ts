/*
 * RESOURCE
 * productlist.nv
 */

export interface ProductListParameters {
  /** Format yyyy-MM-ddTHH:mm:ss */
  changedSince?: string;
  keyword?: string;
  published?: 1 | 0;
  unpublished?: 1 | 0;
  deleted?: 1 | 0;
}

export interface ProductListItem {
  netvisorKey: number;
  productCode: string;
  name: string;
  unitPrice: number;
  unitGrossPrice: number;
  productGroupID: number;
  productGroupDescription: string;
  uri: string;
}

/*
 * RESOURCE
 * getproduct.nv
 */

export interface GetProductParameters {
  id?: number;
  /** Max 400 ids */
  idList?: string;
  eanCode?: string;
  code?: string;
  /** Max 400 codes */
  codeList?: string;
  showSubProducts?: 1;
  replyOption?: 1 | 2 | 3;
}

export interface GetProduct {
  productBaseInformation: {
    netvisorKey: number;
    productCode: string;
    productGroup: string;
    name: string;
    description: string;
    unitPrice: {
      value: number;
      attr: { type: 'net' };
    };
    unitGrossPrice: {
      value: number;
      attr: { type: 'gross' };
    };
    unit: string;
    purchasePrice: number;
    tariffHeading: string;
    comissionPercentage: number;
    isActive: number;
    isSalesProduct: number;
    countryOfOrigin: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
  };
  productBookKeepingDetails: {
    defaultVatPercent: number;
    defaultDomesticAccountNumber: number;
    defaultEuAccountNumber: number;
    defaultOutsideEuAccountNumber: number;
    productDimensions: {
      dimension: {
        dimensionName: {
          value: string;
          attr: { netvisorkey: number };
        };
        dimensionItem: {
          value: string;
          attr: { netvisorkey: number };
        };
      }[];
    };
  };
  productInventoryDetails: {
    inventoryAmount: number;
    inventoryMidPrice: number;
    inventoryValue: number;
    inventoryReservedAmount: number;
    inventoryOrderedAmount: number;
    inventoryAccountNumber: number;
  };
  productAdditionalInformation: {
    productNetWeight: {
      value: number;
      attr: { weightunit: string };
    };
    productGrossWeight: {
      value: number;
      attr: { weightunit: string };
    };
    productPackageInformation: {
      packageWidth: {
        value: number;
        attr: { unit: string };
      };
      packageHeight: {
        value: number;
        attr: { unit: string };
      };
      packageLength: {
        value: number;
        attr: { unit: string };
      };
    };
    primaryEanCode: number;
    secondaryEanCode: number;
  };
  subProductInformation?: {
    parents: {
      product: {
        netvisorKey: number;
        amount: number;
        purchasePriceChange: number;
        unitPriceChange: number;
      }[];
    };
    children: {
      product: {
        netvisorKey: number;
        amount: number;
        purchasePriceChange: number;
        unitPriceChange: number;
      }[];
    };
  };
}

/*
 * RESOURCE
 * product.nv
 */

export interface ProductParameters {
  method: 'add' | 'edit';
  id?: number;
}

export interface Product {
  productBaseInformation: {
    productCode?: string;
    productGroup: string;
    name: string;
    description?: string;
    unitPrice: {
      value: number;
      attr: { type: 'net' };
    };
    unit?: string;
    purchasePrice?: number;
    tariffHeading?: string;
    comissionPercentage?: number;
    isActive: 1 | 0;
    isSalesProduct: 1 | 0;
    inventoryEnabled?: 1 | 0;
    /** 1 = Ei eräkäsittelyä,
     * 2 = Manuaalinen erävalinta,
     * 3 = Toimituspäivän mukaan nuorimmat ensin,
     * 4 = Toimituspäivän mukaan vanhimmat ensin (FIFO),
     * 5 = Viimeisen käyttöpäivän mukaan uusimmat ensin,
     * 6 = Viimeisen käyttöpäivän mukaan vanhimmat ensin,
     * 7 = Valmistuspäiväyksen mukaan uusimmat ensin,
     * 8 = Valmistuspäiväyksen mukaan vanhimmat ensin */
    inventoryBatchLinkingMode?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    countryOfOrigin?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    primaryEanCode?: {
      value: number;
      attr: { type: 'any' | 'ean8' | 'ean13' | 'code128' };
    };
    secondaryEanCode?: {
      value: number;
      attr: { type: 'any' | 'ean8' | 'ean13' | 'code128' };
    };
    inventoryAlertLimit?: number;
  };
  productBookKeepingDetails?: {
    defaultVatPercent: number;
    defaultDomesticAccountNumber?: number;
    defaultEuAccountNumber?: number;
    defaultOutsideEuAccountNumber?: number;
  };
  productAdditionalInformation?: {
    productNetWeight?: number;
    productGrossWeight?: number;
    productWeightUnit?: 'g' | 'kg' | 'tn';
    dimension?: {
      dimensionName: string;
      dimensionItem: string;
    }[];
    productPackageInformation?: {
      /** In centimeters */
      packageWidth: number;
      /** In centimeters */
      packageHeight: number;
      /** In centimeters */
      packageLength: number;
    };
  };
  productCustomTags?: {
    productCustomTag: {
      tagName: string;
      tagValue: {
        value: string;
        attr: { dataType: 'date' | 'text' | 'decimal' | 'enum' };
      };
    }[];
  };
}

/*
 * RESOURCE
 * extendedproductlist.nv
 */

export interface ExtendedProductListParameters {
  replyOptions?: number | string;
  /** Without extended product management, only 'fi' is supported */
  searchLanguage?: 'fi' | 'se' | 'en';
  productNetvisorKeys?: string;
  productNameKeyword?: string;
  productCodeKeyword?: string;
  productEanCode?: string;
  onlySellableProducts?: boolean;
  onlyStoragedProducts?: boolean;
  /** Format yyyy-MM-ddTHH:mm */
  productChangedSince?: string;
  productGroupNetvisorKeys?: string;
  productGroupName?: string;
  productGroupNameKeyword?: string;
  productGroupNameFreeText?: string;
  excludeProductGroupNameFreeText?: string;
  productGroupingCriteriaName?: string;
  productsOnPage?: number;
  page?: number;
}

export interface ExtendedProductList {
  attr: { currentPage: number; pageCount: number; productsOnPage: number; productsOnPages: number };
  products: ExtendedProductListItem[];
}

export interface ExtendedProductListItem {
  netvisorKey: number;
  productCodes: {
    productCode: number;
    productPrimaryEanCode: string;
    productSecondaryEanCode: string;
  };
  productNameTranslations: {
    translation: {
      value: string;
      attr: { language: string };
    }[];
  };
  productDescriptionTranslations: {
    translation: {
      value: string;
      attr: { language: string };
    }[];
  };
  productFeatures: {
    isPublishedProduct: boolean;
    isSellableProduct: boolean;
    isStorageProduct: boolean;
    isProductStructureProduct: boolean;
    isModel: boolean;
    isSummaryOfProducts: boolean;
    lastChangedDate: {
      value: string;
      attr: { format: string };
    };
  };
  productGroup: {
    netvisorKey: number;
    productGroupTranslations?: {
      translation: {
        value: string;
        attr: { language: string };
      }[];
    };
  };
  productUnit: {
    netvisorKey: number;
    productUnitTranslations?: {
      translation: {
        value: string;
        attr: { language: string };
      }[];
    };
  };
  productPriceInformation: {
    defaultNetPrice: {
      value: number;
      attr: { ispricebase: string };
    };
    defaultGrossPrice: number;
    vat: {
      netvisorKey: number;
      percentage: number;
    };
    priceMargin: number;
    provisionPercentage: number;
    priceGroups?: {
      group: {
        netvisorKey: number;
        priceGroupName: string;
        netPrice: number;
        grossPrice: number;
      }[];
    };
    customerPrices?: {
      customer: {
        netvisorKey: number;
        customerCode: number;
        customerName: string;
        netPrice: number;
        grossPrice: number;
      }[];
    };
  };
  productPurchaseInformation?: {
    defaultPurchasePrice: number;
    distirbuterPurchaseInformations?: {
      distributer: {
        netvisorKey: number;
        distributerCode: number;
        distributerName: string;
        distributerProductCode: string;
        distributerProductName: string;
        purchasePrice: number;
        currencyAbbreviation: string;
      }[];
    };
  };
  productStorageInformation?: {
    defaultInvetoryPlace: {
      netvisorKey?: number;
      inventoryPlaceName?: string;
    };
    inventoryPlaceShelves?: {
      inventoryPlaceShelve: {
        inventoryPlaceNetvisorKey: number;
        inventoryPlaceName: string;
        shelveNetvisorKey: number;
        shelveName: string;
      }[];
    };
    alertLimit: number;
    customsTariffHeader: string;
    productBatchLinkingMode?: {
      netvisorKey: number;
      definition: string;
    };
  };
  productShipmentInformation?: {
    defaultProductCountryOfOrigin: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    productNetWeight: {
      value: number;
      attr: { unit: string };
    };
    productGrossWeight: {
      value: number;
      attr: { unit: string };
    };
    productPackageWidth: {
      value: number;
      attr: { unit: string };
    };
    productPackageHeight: {
      value: number;
      attr: { unit: string };
    };
    productPackageLength: {
      value: number;
      attr: { unit: string };
    };
  };
  productGroupingCriterias?: {
    groupingCriteria: {
      translation: {
        value: string;
        attr: { language: string };
      }[];
    }[];
  };
  productAccountInformation?: {
    defaultDomesticAccountNumber: number;
    defaultEuAccountNumber: number;
    defaultOutsideEuAccountNumber: number;
    defaultInventoryAccountNumber: number;
  };
  productDimensionInformation?: {
    dimension: {
      nameNetvisorKey: number;
      dimensionNameName: string;
      detailNetvisorKey: number;
      dimensionDetailName: string;
    }[];
  };
  productInformationFields?: {
    informationField: {
      informationFieldName: string;
      informationFieldItemValue: string;
    }[];
  };
  productReferences?: {
    relatedProducts?: {
      product: {
        netvisorKey: number;
        productCode: string;
        productNameTranslations: {
          translation: {
            value: string;
            attr: { language: string };
          }[];
        };
      }[];
    };
    complementaryProducts?: {
      product: {
        netvisorKey: number;
        productCode: string;
        productNameTranslations: {
          translation: {
            value: string;
            attr: { language: string };
          }[];
        };
      }[];
    };
  };
  productProperties?: {
    property: ProductProperty[];
  };
  subProductInformation?: {
    parents?: {
      product: {
        netvisorKey: number;
        amount: number;
        purchasePriceChange: number;
        unitPriceChange: number;
      }[];
    };
    children?: {
      product: {
        netvisorKey: number;
        amount: number;
        purchasePriceChange: number;
        unitPriceChange: number;
      }[];
    };
  };
  productImages?: {
    image: {
      netvisorKey: number;
      isDefaultImage: boolean;
      mimeType: string;
      title: string;
      fileName: string;
      lastEditedDate: string;
    }[];
  };
  productAttachments?: {
    attachment: {
      netvisorKey: number;
      mimeType: string;
      fileName: string;
    }[];
  };
}

export interface ProductProperty {
  netvisorKey: number;
  propertyTranslations: {
    translation: {
      value: string;
      attr: { language: string };
    }[];
  };
  propertyValues?: {
    netvisorKey: number;
    propertyValueTranslations: {
      translation: {
        value: string;
        attr: { language: string };
      }[];
    };
  }[];
}

/*
 * RESOURCE
 * inventorybywarehouse.nv
 */

export interface InventoryByWarehouseParameters {
  productId?: number;
  productIdList?: string;
  inventoryPlaceId?: number;
  inventoryPlaceName?: string;
  limitVendorId?: number;
  changedSince?: string;
  limitUnderAlertLimit?: 1;
  productGroupName?: string;
}

export interface InventoryByWarehouse {
  product: {
    netvisorKey: number;
    name: string;
    code: string;
    groupName: string;
    productUri: string;
    warehouse: {
      netvisorKey: number;
      name: string;
      reservedAmount: number;
      orderedAmount: number;
      inventoryAmount: number;
    };
    totalReservedAmount: number;
    totalOrderedAmount: number;
    totalAmount: number;
  }[];
}

/*
 * RESOURCE
 * warehouseevent.nv
 */

export interface WarehouseEvent {
  description?: string;
  reference: string;
  deliveryMethod?: string;
  distributer?: {
    value: string;
    attr: { type: 'netvisor' | 'customer' };
  };
  warehouseEventLines: {
    warehouseEventLine: {
      eventType: {
        value: 'Hankinta' | 'Myynti' | 'Inventointi' | 'Korjaus' | 'Varastosiirto' | 'Valmistus';
        attr: { type: 'customer' };
      };
      product: {
        value: string;
        attr: { type: 'netvisor' | 'customer' };
      };
      inventoryPlace?:
        | {
            value: number;
            attr: { type: 'netvisor' };
          }
        | string;
      description?: string;
      quantity: number;
      unitPrice: number;
      valueDate: {
        /** Format YYYY-MM-DD */
        value: string;
        attr: { format: 'ansi' };
      };
      status?: 'open' | 'handled' | 'bypassed';
    }[];
  };
}
