import { NetvisorApiClient } from '..';
import {
  ProductListItem,
  ProductListParameters,
  GetProductParameters,
  GetProduct,
  ExtendedProductListParameters,
  ExtendedProductListItem,
  ExtendedProductList,
  ProductProperty,
  ProductParameters,
  Product,
  InventoryByWarehouse,
  InventoryByWarehouseParameters,
  WarehouseEvent
} from '../interfaces/products';
import { NetvisorMethod, parseXml, buildXml, forceArray } from './_method';

export class NetvisorProductsMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get product list from Netvisor
   * @example await productList({ showhidden: 1 })
   * @returns {ProductListItem[]} If no products were retrieved, empty array will be returned.
   */
  async productList(params?: ProductListParameters): Promise<ProductListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('productlist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const productList: ProductListItem[] = [];
    // Add items to return array
    if (xmlObject.productlist.product) {
      forceArray(xmlObject.productlist.product).forEach((xmlProductItem) => {
        productList.push({
          netvisorKey: parseInt(xmlProductItem.netvisorkey),
          productCode: xmlProductItem.productcode,
          name: xmlProductItem.name,
          unitPrice: parseFloat(xmlProductItem.unitprice.replace(',', '.')),
          unitGrossPrice: parseFloat(xmlProductItem.unitgrossprice.replace(',', '.')),
          productGroupID: parseInt(xmlProductItem.productgroupid),
          productGroupDescription: xmlProductItem.productgroupdescription,
          uri: xmlProductItem.uri
        });
      });
    }
    return productList;
  }

  /**
   * Get product(s) from Netvisor
   * @example await getProduct({ id: 45 })
   * @returns {GetProduct[]} Returns array even when getting only a single product.
   */
  async getProduct(params?: GetProductParameters): Promise<GetProduct[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getproduct.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const products: GetProduct[] = [];
    // Create array from the xml result
    let xmlProducts: any[] = [];
    if (xmlObject.products) {
      if (xmlObject.products.product) {
        // If there were multiple products in the result
        xmlProducts = forceArray(xmlObject.products.product);
      }
    } else {
      if (xmlObject.product) {
        // If there were a single product in the result
        xmlProducts = forceArray(xmlObject.product);
      }
    }

    xmlProducts.forEach((xmlProduct) => {
      const product: GetProduct = {
        productBaseInformation: {
          netvisorKey: parseInt(xmlProduct.productbaseinformation.netvisorkey),
          productCode: xmlProduct.productbaseinformation.productcode,
          productGroup: xmlProduct.productbaseinformation.productgroup,
          name: xmlProduct.productbaseinformation.name,
          description: xmlProduct.productbaseinformation.description,
          unitPrice: {
            value: parseFloat(xmlProduct.productbaseinformation.unitprice.value.replace(',', '.')),
            attr: xmlProduct.productbaseinformation.unitprice.attr
          },
          unitGrossPrice: {
            value: parseFloat(xmlProduct.productbaseinformation.unitgrossprice.value.replace(',', '.')),
            attr: xmlProduct.productbaseinformation.unitgrossprice.attr
          },
          unit: xmlProduct.productbaseinformation.unit,
          purchasePrice: parseFloat(xmlProduct.productbaseinformation.purchaseprice.replace(',', '.')),
          tariffHeading: xmlProduct.productbaseinformation.tariffheading,
          comissionPercentage: parseFloat(xmlProduct.productbaseinformation.comissionpercentage.replace(',', '.')),
          isActive: parseInt(xmlProduct.productbaseinformation.isactive),
          isSalesProduct: parseInt(xmlProduct.productbaseinformation.issalesproduct),
          countryOfOrigin: {
            value: xmlProduct.productbaseinformation.countryoforigin.value,
            attr: xmlProduct.productbaseinformation.countryoforigin.attr
          }
        },
        productBookKeepingDetails: {
          defaultVatPercent: parseFloat(xmlProduct.productbookkeepingdetails.defaultvatpercent.replace(',', '.')),
          defaultDomesticAccountNumber: parseInt(xmlProduct.productbookkeepingdetails.defaultdomesticaccountnumber),
          defaultEuAccountNumber: parseInt(xmlProduct.productbookkeepingdetails.defaulteuaccountnumber),
          defaultOutsideEuAccountNumber: parseInt(xmlProduct.productbookkeepingdetails.defaultoutsideeuaccountnumber),
          productDimensions: {
            dimension: []
          }
        },
        productInventoryDetails: {
          inventoryAmount: parseFloat(xmlProduct.productinventorydetails.inventoryamount.replace(',', '.')),
          inventoryMidPrice: parseFloat(xmlProduct.productinventorydetails.inventorymidprice.replace(',', '.')),
          inventoryValue: parseFloat(xmlProduct.productinventorydetails.inventoryvalue.replace(',', '.')),
          inventoryReservedAmount: parseFloat(xmlProduct.productinventorydetails.inventoryreservedamount.replace(',', '.')),
          inventoryOrderedAmount: parseFloat(xmlProduct.productinventorydetails.inventoryorderedamount.replace(',', '.')),
          inventoryAccountNumber: parseInt(xmlProduct.productinventorydetails.inventoryaccountnumber)
        },
        productAdditionalInformation: {
          productNetWeight: {
            value: parseFloat(xmlProduct.productadditionalinformation.productnetweight.value?.replace(',', '.')) || 0,
            attr: xmlProduct.productadditionalinformation.productnetweight.attr
          },
          productGrossWeight: {
            value: parseFloat(xmlProduct.productadditionalinformation.productgrossweight.value?.replace(',', '.')) || 0,
            attr: xmlProduct.productadditionalinformation.productgrossweight.attr
          },
          productPackageInformation: {
            packageWidth: {
              value:
                parseFloat(xmlProduct.productadditionalinformation.productpackageinformation.packagewidth.value?.replace(',', '.')) || 0,
              attr: xmlProduct.productadditionalinformation.productpackageinformation.packagewidth.attr
            },
            packageHeight: {
              value:
                parseFloat(xmlProduct.productadditionalinformation.productpackageinformation.packageheight.value?.replace(',', '.')) || 0,
              attr: xmlProduct.productadditionalinformation.productpackageinformation.packageheight.attr
            },
            packageLength: {
              value:
                parseFloat(xmlProduct.productadditionalinformation.productpackageinformation.packagelength.value?.replace(',', '.')) || 0,
              attr: xmlProduct.productadditionalinformation.productpackageinformation.packagelength.attr
            }
          },
          primaryEanCode: xmlProduct.productadditionalinformation.primaryeancode,
          secondaryEanCode: xmlProduct.productadditionalinformation.secondaryeancode
        }
      };
      // Add dimensions to product
      if (xmlProduct.productbookkeepingdetails.productdimensions?.dimension) {
        forceArray(xmlProduct.productbookkeepingdetails.productdimensions.dimension).forEach((xmlDimension) => {
          product.productBookKeepingDetails.productDimensions.dimension.push(xmlDimension);
        });
      }
      // Add sub product information to product if it exists
      if (xmlProduct.subproductinformation) {
        console.log('Subproducts detected');
        product.subProductInformation = {
          parents: {
            product: []
          },
          children: {
            product: []
          }
        };
        // Add parent products to product
        if (xmlProduct.subproductinformation.parents.product) {
          forceArray(xmlProduct.subproductinformation.parents.product).forEach((xmlParentProduct) => {
            product.subProductInformation!.parents.product.push({
              netvisorKey: parseInt(xmlParentProduct.netvisorkey),
              amount: parseFloat(xmlParentProduct.amount.replace(',', '.')),
              purchasePriceChange: parseFloat(xmlParentProduct.purchasepricechange.replace(',', '.')),
              unitPriceChange: parseFloat(xmlParentProduct.unitpricechange.replace(',', '.'))
            });
          });
        }
        // Add child products to product
        if (xmlProduct.subproductinformation.children.product) {
          forceArray(xmlProduct.subproductinformation.children.product).forEach((xmlChildProduct) => {
            product.subProductInformation!.children.product.push({
              netvisorKey: parseInt(xmlChildProduct.netvisorkey),
              amount: parseFloat(xmlChildProduct.amount.replace(',', '.')),
              purchasePriceChange: parseFloat(xmlChildProduct.purchasepricechange.replace(',', '.')),
              unitPriceChange: parseFloat(xmlChildProduct.unitpricechange.replace(',', '.'))
            });
          });
        }
      }
      products.push(product);
    });
    return products;
  }

  /**
   * Create or edit a product in Netvisor. Edit will not work with extended product management.
   * @example await product(productData, { method: 'add' })
   * @returns the added or edited product's netvisor key
   */
  async product(product: Product, params: ProductParameters): Promise<string> {
    const response = await this._client.post('product.nv', buildXml({ root: { product: product } }), params);
    if (params.method === 'add') return parseXml(response).replies.inserteddataidentifier;
    return params.id?.toString() || '';
  }

  /**
   * Get extended product list from Netvisor
   * @example await extendedProductList({ replyOptions: 3 })
   * @returns {ExtendedProductList} If no products were retrieved, products array under ExtendedProductList will be empty.
   */
  async extendedProductList(params?: ExtendedProductListParameters): Promise<ExtendedProductList> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('extendedproductlist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const extendedProductList: ExtendedProductList = {
      attr: {
        currentPage: parseInt(xmlObject.products.attr.currentpage),
        pageCount: parseInt(xmlObject.products.attr.pagecount),
        productsOnPage: parseInt(xmlObject.products.attr.productsonpage),
        productsOnPages: parseInt(xmlObject.products.attr.productsonpages)
      },
      products: []
    };
    // Add items to return array
    if (xmlObject.products.product) {
      forceArray(xmlObject.products.product).forEach((xmlExtProductItem) => {
        // Create extended product item and fill it with mandatory properties
        const extProductItem: ExtendedProductListItem = {
          netvisorKey: parseInt(xmlExtProductItem.netvisorkey),
          productCodes: {
            productCode: parseInt(xmlExtProductItem.productcodes.productcode),
            productPrimaryEanCode: xmlExtProductItem.productcodes.productprimaryeancode,
            productSecondaryEanCode: xmlExtProductItem.productcodes.productsecondaryeancode
          },
          productNameTranslations: {
            translation: forceArray(xmlExtProductItem.productnametranslations.translation)
          },
          productDescriptionTranslations: {
            translation: forceArray(xmlExtProductItem.productdescriptiontranslations.translation)
          },
          productFeatures: {
            isPublishedProduct: xmlExtProductItem.productfeatures.ispublishedproduct === 'true' ? true : false,
            isSellableProduct: xmlExtProductItem.productfeatures.issellableproduct === 'true' ? true : false,
            isStorageProduct: xmlExtProductItem.productfeatures.isstorageproduct === 'true' ? true : false,
            isProductStructureProduct: xmlExtProductItem.productfeatures.isproductstructureproduct === 'true' ? true : false,
            isModel: xmlExtProductItem.productfeatures.ismodel === 'true' ? true : false,
            isSummaryOfProducts: xmlExtProductItem.productfeatures.issummaryofproducts === 'true' ? true : false,
            lastChangedDate: {
              value: xmlExtProductItem.productfeatures.lastchangeddate.value,
              attr: xmlExtProductItem.productfeatures.lastchangeddate.attr
            }
          },
          productGroup: {
            netvisorKey: parseInt(xmlExtProductItem.productgroup.netvisorkey),
            productGroupTranslations: {
              translation: forceArray(xmlExtProductItem.productgroup.productgrouptranslations.translation)
            }
          },
          productUnit: {
            netvisorKey: parseInt(xmlExtProductItem.productunit.netvisorkey),
            productUnitTranslations: {
              translation: forceArray(xmlExtProductItem.productunit.productunittranslations.translation)
            }
          },
          productPriceInformation: {
            defaultNetPrice: {
              value: parseFloat(xmlExtProductItem.productpriceinformation.defaultnetprice.value.replace(',', '.')),
              attr: xmlExtProductItem.productpriceinformation.defaultnetprice.attr
            },
            defaultGrossPrice: parseFloat(xmlExtProductItem.productpriceinformation.defaultgrossprice.replace(',', '.')),
            vat: {
              netvisorKey: parseInt(xmlExtProductItem.productpriceinformation.vat.netvisorkey),
              percentage: parseFloat(xmlExtProductItem.productpriceinformation.vat.percentage.replace(',', '.'))
            },
            priceMargin: parseFloat(xmlExtProductItem.productpriceinformation.pricemargin.replace(',', '.')),
            provisionPercentage: parseFloat(xmlExtProductItem.productpriceinformation.provisionpercentage.replace(',', '.'))
          }
        };

        // Add all the optional properties

        // Price groups
        if (xmlExtProductItem.productpriceinformation.pricegroups) {
          extProductItem.productPriceInformation.priceGroups = { group: [] };
          forceArray(xmlExtProductItem.productpriceinformation.pricegroups.group).forEach((xmlPriceGroup: any) => {
            extProductItem.productPriceInformation.priceGroups!.group.push({
              netvisorKey: parseInt(xmlPriceGroup.netvisorkey),
              priceGroupName: xmlPriceGroup.pricegroupname,
              netPrice: parseFloat(xmlPriceGroup.netprice.replace(',', '.')),
              grossPrice: parseFloat(xmlPriceGroup.grossprice.replace(',', '.'))
            });
          });
        }
        // Customer prices
        if (xmlExtProductItem.productpriceinformation.customerprices) {
          extProductItem.productPriceInformation.customerPrices = { customer: [] };
          forceArray(xmlExtProductItem.productpriceinformation.customerprices.customer).forEach((xmlCustomerPrice: any) => {
            extProductItem.productPriceInformation.customerPrices!.customer.push({
              netvisorKey: parseInt(xmlCustomerPrice.netvisorkey),
              customerCode: parseInt(xmlCustomerPrice.customercode),
              customerName: xmlCustomerPrice.customername,
              netPrice: parseFloat(xmlCustomerPrice.netprice.replace(',', '.')),
              grossPrice: parseFloat(xmlCustomerPrice.grossprice.replace(',', '.'))
            });
          });
        }
        // Product purchase information
        if (xmlExtProductItem.productpurchaseinformation) {
          extProductItem.productPurchaseInformation = {
            defaultPurchasePrice: parseFloat(xmlExtProductItem.productpurchaseinformation.defaultpurchaseprice.replace(',', '.'))
          };
          if (xmlExtProductItem.productpurchaseinformation.distributerpurchaseinformations) {
            extProductItem.productPurchaseInformation.distirbuterPurchaseInformations = { distributer: [] };
            forceArray(xmlExtProductItem.productpurchaseinformation.distributerpurchaseinformations.distributer).forEach(
              (xmlDistributer: any) => {
                extProductItem.productPurchaseInformation!.distirbuterPurchaseInformations!.distributer.push({
                  netvisorKey: parseInt(xmlDistributer.netvisorkey),
                  distributerCode: parseInt(xmlDistributer.distributercode),
                  distributerName: xmlDistributer.distributername,
                  distributerProductCode: xmlDistributer.distributerproductcode,
                  distributerProductName: xmlDistributer.distributerproductname,
                  purchasePrice: parseFloat(xmlDistributer.purchaseprice.replace(',', '.')),
                  currencyAbbreviation: xmlDistributer.currencyabbreviation
                });
              }
            );
          }
        }
        // Product storage information
        if (xmlExtProductItem.productstorageinformation) {
          extProductItem.productStorageInformation = {
            defaultInvetoryPlace: {},
            alertLimit: parseFloat(xmlExtProductItem.productstorageinformation.alertlimit.replace(',', '.')),
            customsTariffHeader: xmlExtProductItem.productstorageinformation.customstariffheading
          };
          if (xmlExtProductItem.productstorageinformation.defaultinventoryplace) {
            extProductItem.productStorageInformation.defaultInvetoryPlace = {
              netvisorKey: parseInt(xmlExtProductItem.productstorageinformation.defaultinventoryplace.netvisorkey) || undefined,
              inventoryPlaceName: xmlExtProductItem.productstorageinformation.defaultinventoryplace.inventoryplacename || undefined
            };
          }
          if (xmlExtProductItem.productstorageinformation.inventoryplaceshelves) {
            extProductItem.productStorageInformation.inventoryPlaceShelves = { inventoryPlaceShelve: [] };
            forceArray(xmlExtProductItem.productstorageinformation.inventoryplaceshelves.inventoryplaceshelve).forEach((xmlShelf: any) => {
              extProductItem.productStorageInformation!.inventoryPlaceShelves!.inventoryPlaceShelve.push({
                inventoryPlaceNetvisorKey: parseInt(xmlShelf.inventoryplacenetvisorkey),
                inventoryPlaceName: xmlShelf.inventoryplacename,
                shelveNetvisorKey: parseInt(xmlShelf.shelvenetvisorkey),
                shelveName: xmlShelf.shelvename
              });
            });
          }
          if (xmlExtProductItem.productstorageinformation.productbatchlinkingmode) {
            extProductItem.productStorageInformation.productBatchLinkingMode = {
              netvisorKey: parseInt(xmlExtProductItem.productstorageinformation.productbatchlinkingmode.netvisorkey),
              definition: xmlExtProductItem.productstorageinformation.productbatchlinkingmode.definition
            };
          }
        }
        // Product shipment information
        if (xmlExtProductItem.productshipmentinformation) {
          extProductItem.productShipmentInformation = {
            defaultProductCountryOfOrigin: {
              value: xmlExtProductItem.productshipmentinformation.defaultproductcountryoforigin.value || '',
              attr: xmlExtProductItem.productshipmentinformation.defaultproductcountryoforigin.attr
            },
            productNetWeight: {
              value: parseFloat(xmlExtProductItem.productshipmentinformation.productnetweight.value.replace(',', '.')),
              attr: xmlExtProductItem.productshipmentinformation.productnetweight.attr
            },
            productGrossWeight: {
              value: parseFloat(xmlExtProductItem.productshipmentinformation.productgrossweight.value.replace(',', '.')),
              attr: xmlExtProductItem.productshipmentinformation.productgrossweight.attr
            },
            productPackageWidth: {
              value: parseFloat(xmlExtProductItem.productshipmentinformation.productpackagewidth.value.replace(',', '.')),
              attr: xmlExtProductItem.productshipmentinformation.productpackagewidth.attr
            },
            productPackageHeight: {
              value: parseFloat(xmlExtProductItem.productshipmentinformation.productpackageheight.value.replace(',', '.')),
              attr: xmlExtProductItem.productshipmentinformation.productpackageheight.attr
            },
            productPackageLength: {
              value: parseFloat(xmlExtProductItem.productshipmentinformation.productpackagelength.value.replace(',', '.')),
              attr: xmlExtProductItem.productshipmentinformation.productpackagelength.attr
            }
          };
        }
        // Product grouping criterias
        if (xmlExtProductItem.productgrupingcriteriainformation) {
          extProductItem.productGroupingCriterias = { groupingCriteria: [] };
          forceArray(xmlExtProductItem.productgrupingcriteriainformation.groupingcriteria).forEach((xmlCriteria: any) => {
            if (xmlCriteria.translation) {
              const translations: { value: string; attr: { language: string } }[] = [];
              forceArray(xmlCriteria.translation).forEach((xmlTranslation: any) => translations.push(xmlTranslation));
              extProductItem.productGroupingCriterias!.groupingCriteria.push({ translation: translations });
            }
          });
        }
        // Product account information
        if (xmlExtProductItem.productaccountinformation) {
          extProductItem.productAccountInformation = {
            defaultDomesticAccountNumber: parseInt(xmlExtProductItem.productaccountinformation.defaultdomesticaccountnumber),
            defaultEuAccountNumber: parseInt(xmlExtProductItem.productaccountinformation.defaulteuaccountnumber),
            defaultOutsideEuAccountNumber: parseInt(xmlExtProductItem.productaccountinformation.defaultoutsideeuaccountnumber),
            defaultInventoryAccountNumber: parseInt(xmlExtProductItem.productaccountinformation.defaultinventoryaccountnumber)
          };
        }
        // Product dimension information
        if (xmlExtProductItem.productdimensioninformation) {
          extProductItem.productDimensionInformation = { dimension: [] };
          forceArray(xmlExtProductItem.productdimensioninformation.dimension).forEach((xmlDimension: any) => {
            extProductItem.productDimensionInformation!.dimension.push({
              nameNetvisorKey: parseInt(xmlDimension.namenetvisorkey),
              dimensionNameName: xmlDimension.dimensionnamename,
              detailNetvisorKey: parseInt(xmlDimension.detailnetvisorkey),
              dimensionDetailName: xmlDimension.dimensiondetailname
            });
          });
        }
        // Product information fields
        if (xmlExtProductItem.productinformationfields) {
          extProductItem.productInformationFields = { informationField: [] };
          forceArray(xmlExtProductItem.productinformationfields.informationfield).forEach((xmlField: any) => {
            extProductItem.productInformationFields!.informationField.push({
              informationFieldName: xmlField.informationfieldname,
              informationFieldItemValue: xmlField.informationfielditemvalue
            });
          });
        }
        // Product references
        if (xmlExtProductItem.productreferences) {
          if (xmlExtProductItem.productreferences.relatedproducts) {
            extProductItem.productReferences = { relatedProducts: { product: [] } };
            forceArray(xmlExtProductItem.productreferences.relatedproducts.product).forEach((xmlProduct: any) => {
              extProductItem.productReferences!.relatedProducts!.product.push({
                netvisorKey: parseInt(xmlProduct.netvisorkey),
                productCode: xmlProduct.productcode,
                productNameTranslations: {
                  translation: forceArray(xmlProduct.productnametranslations.translation)
                }
              });
            });
          }
          if (xmlExtProductItem.productreferences.complementaryproducts) {
            extProductItem.productReferences = { complementaryProducts: { product: [] } };
            forceArray(xmlExtProductItem.productreferences.complementaryproducts.product).forEach((xmlProduct: any) => {
              extProductItem.productReferences!.complementaryProducts!.product.push({
                netvisorKey: parseInt(xmlProduct.netvisorkey),
                productCode: xmlProduct.productcode,
                productNameTranslations: {
                  translation: forceArray(xmlProduct.productnametranslations.translation)
                }
              });
            });
          }
        }
        // Product properties
        if (xmlExtProductItem.productproperties) {
          extProductItem.productProperties = { property: [] };
          forceArray(xmlExtProductItem.productproperties.property).forEach((xmlProperty: any) => {
            const property: ProductProperty = {
              netvisorKey: parseInt(xmlProperty.netvisorkey),
              propertyTranslations: {
                translation: forceArray(xmlProperty.propertytranslations.translation)
              }
            };
            if (xmlProperty.propertyvalues) {
              property.propertyValues = [];
              xmlProperty.propertyvalues.forEach((xmlPropertyValue: any) => {
                property.propertyValues!.push({
                  netvisorKey: parseInt(xmlPropertyValue.netvisorkey),
                  propertyValueTranslations: {
                    translation: forceArray(xmlPropertyValue.propertyvaluetranslations.translation)
                  }
                });
              });
            }
            extProductItem.productProperties!.property.push(property);
          });
        }
        // Sub product information
        if (xmlExtProductItem.subproductinformation) {
          extProductItem.subProductInformation = {};
          if (xmlExtProductItem.subproductinformation.parents) {
            extProductItem.subProductInformation.parents = { product: [] };
            forceArray(xmlExtProductItem.subproductinformation.parents.product).forEach((xmlSubProduct: any) => {
              extProductItem.subProductInformation!.parents!.product.push({
                netvisorKey: parseInt(xmlSubProduct.netvisorkey),
                amount: parseFloat(xmlSubProduct.amount.replace(',', '.')),
                purchasePriceChange: parseFloat(xmlSubProduct.purchasepricechange.replace(',', '.')),
                unitPriceChange: parseFloat(xmlSubProduct.unitpricechange.replace(',', '.'))
              });
            });
          }
          if (xmlExtProductItem.subproductinformation.children) {
            extProductItem.subProductInformation.children = { product: [] };
            forceArray(xmlExtProductItem.subproductinformation.children.product).forEach((xmlSubProduct: any) => {
              extProductItem.subProductInformation!.children!.product.push({
                netvisorKey: parseInt(xmlSubProduct.netvisorkey),
                amount: parseFloat(xmlSubProduct.amount.replace(',', '.')),
                purchasePriceChange: parseFloat(xmlSubProduct.purchasepricechange.replace(',', '.')),
                unitPriceChange: parseFloat(xmlSubProduct.unitpricechange.replace(',', '.'))
              });
            });
          }
        }
        // Product images
        if (xmlExtProductItem.productimages) {
          extProductItem.productImages = { image: [] };
          forceArray(xmlExtProductItem.productimages.image).forEach((xmlImage: any) => {
            extProductItem.productImages!.image.push({
              netvisorKey: parseInt(xmlImage.netvisorkey),
              isDefaultImage: xmlImage.isdefaultimage === 'true' ? true : false,
              mimeType: xmlImage.mimetype,
              title: xmlImage.title,
              fileName: xmlImage.filename,
              lastEditedDate: xmlImage.lastediteddate
            });
          });
        }
        // Product attachments
        if (xmlExtProductItem.productattachments) {
          extProductItem.productAttachments = { attachment: [] };
          forceArray(xmlExtProductItem.productattachments.attachment).forEach((xmlAttachment: any) => {
            extProductItem.productAttachments!.attachment.push({
              netvisorKey: parseInt(xmlAttachment.netvisorkey),
              mimeType: xmlAttachment.mimetype,
              fileName: xmlAttachment.filename
            });
          });
        }

        // Push the product to the return array
        extendedProductList.products.push(extProductItem);
      });
    }
    return extendedProductList;
  }

  /**
   * Get inventory by warehouse from Netvisor
   * @example await inventoryByWarehouse({ productId: 77, inventoryPlaceId: 3 })
   * @returns {InventoryByWarehouse} If no inventory was retrieved, product array will be empty.
   */
  async inventoryByWarehouse(params?: InventoryByWarehouseParameters): Promise<InventoryByWarehouse> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('inventorybywarehouse.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return object
    const inventoryList: InventoryByWarehouse = { product: [] };
    // Add items to return object
    if (xmlObject.inventorybywarehouse.product) {
      forceArray(xmlObject.inventorybywarehouse.product).forEach((xmlInventoryItem) => {
        inventoryList.product.push({
          netvisorKey: parseInt(xmlInventoryItem.netvisorkey),
          name: xmlInventoryItem.name,
          code: xmlInventoryItem.code,
          groupName: xmlInventoryItem.groupname,
          productUri: xmlInventoryItem.producturi,
          warehouse: {
            netvisorKey: parseInt(xmlInventoryItem.warehouse.netvisorkey),
            name: xmlInventoryItem.warehouse.name,
            reservedAmount: parseFloat(xmlInventoryItem.warehouse.reservedamount.replace(',', '.')),
            orderedAmount: parseFloat(xmlInventoryItem.warehouse.orderedamount.replace(',', '.')),
            inventoryAmount: parseFloat(xmlInventoryItem.warehouse.inventoryamount.replace(',', '.'))
          },
          totalReservedAmount: parseFloat(xmlInventoryItem.totalreservedamount.replace(',', '.')),
          totalOrderedAmount: parseFloat(xmlInventoryItem.totalorderedamount.replace(',', '.')),
          totalAmount: parseFloat(xmlInventoryItem.totalamount.replace(',', '.'))
        });
      });
    }
    return inventoryList;
  }

  /**
   * Create a new warehouse event to Netvisor
   * @example await warehouseEvent(eventData);
   * @returns {string} The created warehouse event's netvisor key
   */
  async warehouseEvent(event: WarehouseEvent): Promise<string> {
    const response = await this._client.post('warehouseevent.nv', buildXml({ root: { warehouseevent: event } }));
    return parseXml(response).replies.inserteddataidentifier;
  }
}
