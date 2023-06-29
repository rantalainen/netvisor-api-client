/*
 * RESOURCE
 * dimensionlist.nv
 */

export interface DimensionListParameters {
  showhidden?: 1;
}

export interface DimensionListItem {
  netvisorKey: number;
  name: number;
  isHidden: boolean;
  linkType: number;
  dimensionDetails: {
    dimensionDetail: {
      netvisorKey: number;
      name: string;
      isHidden: boolean;
      level: number;
      sort: number;
      endSort: number;
      fatherId: number;
    }[];
  };
}
