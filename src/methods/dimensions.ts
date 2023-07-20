import { NetvisorApiClient } from '..';
import { NetvisorMethod, parseXml, buildXml, forceArray } from './_method';
import {
  DimensionListParameters,
  DimensionListItem,
  DimensionItemParameters,
  DimensionItem,
  DimensionDeleteParameters
} from '../interfaces/dimensions';

export class NetvisorDimensionMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get dimension list from Netvisor
   * @example await dimensionList({ showhidden: 1 })
   * @returns {DimensionListItem[]} If no dimensions were retrieved, empty array will be returned.
   */
  async dimensionList(params?: DimensionListParameters): Promise<DimensionListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('dimensionlist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const dimensionList: DimensionListItem[] = [];
    // Add items to return array
    if (xmlObject.dimensionnamelist.dimensionname) {
      forceArray(xmlObject.dimensionnamelist.dimensionname).forEach((xmlDimension) => {
        // Create a template for dimension item
        const dimensionTemplate: DimensionListItem = {
          netvisorKey: parseInt(xmlDimension.netvisorkey),
          name: xmlDimension.name,
          isHidden: xmlDimension.ishidden === 'True' ? true : false,
          linkType: parseInt(xmlDimension.linktype),
          dimensionDetails: {
            dimensionDetail: []
          }
        };
        // Add the dimension details if there is any
        if (xmlDimension.dimensiondetails.dimensiondetail) {
          forceArray(xmlDimension.dimensiondetails.dimensiondetail).forEach((xmlDimensionDetail) => {
            dimensionTemplate.dimensionDetails.dimensionDetail.push({
              netvisorKey: parseInt(xmlDimensionDetail.netvisorkey),
              name: xmlDimensionDetail.name,
              isHidden: xmlDimensionDetail.ishidden === 'True' ? true : false,
              level: parseInt(xmlDimensionDetail.level),
              sort: parseInt(xmlDimensionDetail.sort),
              endSort: parseInt(xmlDimensionDetail.endsort),
              fatherId: parseInt(xmlDimensionDetail.fatherid)
            });
          });
        }
        dimensionList.push(dimensionTemplate);
      });
    }
    return dimensionList;
  }

  /**
   * Adds new dimension item to Netvisor
   * @example await dimensionItem(dimensionItem, { method: 'add' })
   */
  async dimensionItem(dimensionItem: DimensionItem, params: DimensionItemParameters): Promise<void> {
    await this._client.post('dimensionitem.nv', buildXml({ root: { dimensionitem: dimensionItem } }), params);
    return;
  }

  /**
   * Hides existing dimension item in Netvisor
   * @example await dimensionDelete({ dimensionName: 'Kustannuspaikka', dimensionSubName: 'KP1' })
   */
  async dimensionDelete(params: DimensionDeleteParameters): Promise<void> {
    await this._client.post('dimensiondelete.nv', undefined, params);
    return;
  }
}
