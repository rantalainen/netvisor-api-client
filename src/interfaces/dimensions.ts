/*
 * RESOURCE
 * dimensionlist.nv
 */

export interface DimensionListParameters {
  showhidden?: 1;
}

export interface DimensionListItem {
  netvisorKey: number;
  name: string;
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

/*
 * RESOURCE
 * dimensionitem.nv
 */

export interface DimensionItemParameters {
  method: 'add' | 'edit';
  updateParentReference?: true;
}

export interface DimensionItem {
  name?: string;
  item?: string;
  /** Mandatory when editing existing dimension item */
  oldItem?: string;
  /** Mandatory when adding new dimension item under existing dimension item */
  fatherId?: number;
  /** Mandatory when adding new dimension item under existing dimension item */
  fatherItem?: string;
  isHidden?: boolean;
}

/*
 * RESOURCE
 * dimensiondelete.nv
 */

export interface DimensionDeleteParameters {
  dimensionName: string;
  dimensionSubName: string;
}
