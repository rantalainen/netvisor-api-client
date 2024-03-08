/*
 * RESOURCE
 * tripexpense.nv
 */

export interface TripExpense {
  header: string;
  description?: string;
  customLines?: {
    customLine: {
      employeeIdentifier: {
        value: string;
        attr: { type: 'number' | 'finnishpersonalidentifier' };
      };
      ratio: {
        value: string;
        attr: { type: 'name' };
      };
      amount: number;
      customLineUnitPrice:
        | number
        | {
            value: number;
            attr: { iso4217currencycode: string; currencyrate: number };
          };
      vatPercentage?: number;
      lineDescription: string;
      beginDate: string;
      endDate: string;
      crmProcessIdentifier?: string;
      customerIdentifier?: {
        value: string;
        attr: { type: 'netvisor' | 'customer' };
      };
      expenseAccountNumber?: number;
      lineStatus?: 'open' | 'confirmed' | 'contentsupervisored' | 'accepted' | 'paid';
      dimension?: {
        dimensionName: string;
        dimensionItem: string | { value: string; attr: { fatherid: number } };
      };
      tripExpenseAttachments?: {
        tripExpenseAttachment: {
          mimeType: string;
          attachmentDescription: string;
          fileName: string;
          /** Base64 encoded */
          documentData: string;
        }[];
      };
    }[];
  };
  travelLines?: {
    travelLine: {
      employeeIdentifier: {
        value: string;
        attr: { type: 'number' | 'finnishpersonalidentifier' };
      };
      travelType:
        | 'car'
        | 'car_with_trailer'
        | 'car_with_caravan'
        | 'car_with_heavy_cargo'
        | 'car_with_big_machinery'
        | 'car_with_dog'
        | 'car_travel_in_rough_terrain'
        | 'motorboat_max_50hp'
        | 'motorboat_over_50hp'
        | 'snowmobile'
        | 'atv'
        | 'motorbike'
        | 'moped'
        | 'other'
        | 'carbenefit';
      passengerAmount: number;
      kilometerAmount: number;
      unitPrice?: number;
      lineDescription: string;
      /** YYYY-MM-DD */
      travelDate: string;
      routeDescription: string;
      crmProcessIdentifier?: string;
      customerIdentifier?: {
        value: string;
        attr: { type: 'netvisor' | 'customer' };
      };
      lineStatus?: 'open' | 'confirmed' | 'contentsupervisored' | 'accepted' | 'paid';
      dimension?: {
        dimensionName: string;
        dimensionItem: string | { value: string; attr: { fatherid: number } };
      }[];
      tripExpenseAttachments?: {
        tripExpenseAttachment: {
          mimeType: string;
          attachmentDescription: string;
          fileName: string;
          /** Base64 encoded */
          documentData: string;
        }[];
      };
    }[];
  };
  dailyCompensationLines?: {
    dailyCompensationLine: {
      employeeIdentifier: {
        value: string;
        attr: { type: 'number' | 'finnishpersonalidentifier' };
      };
      compensationType: 'domesticfull' | 'domestichalf' | 'foreign';
      amount: number;
      unitPrice?: number;
      lineDescription: string;
      /** YYYY-MM-DD HH:mm:ss */
      timeOfDeparture: string;
      /** YYYY-MM-DD HH:mm:ss */
      returnTime: string;
      crmProcessIdentifier?: string;
      customerIdentifier?: {
        value: string;
        attr: { type: 'netvisor' | 'customer' };
      };
      lineStatus?: 'open' | 'confirmed' | 'contentsupervisored' | 'accepted' | 'paid';
      dimension?: {
        dimensionName: string;
        dimensionItem: string | { value: string; attr: { fatherid: number } };
      }[];
      tripExpenseAttachments?: {
        tripExpenseAttachment: {
          mimeType: string;
          attachmentDescription: string;
          fileName: string;
          /** Base64 encoded */
          documentData: string;
        }[];
      };
    }[];
  };
}

/*
 * RESOURCE
 * workday.nv
 */

export interface Workday {
  date: {
    value: string;
    attr: {
      format: 'ansi';
      /** Default is 'replace' if method attribute is not given */
      method?: 'replace' | 'increment';
    };
  };
  employeeIdentifier: {
    value: string;
    attr: {
      type: 'number' | 'personalidentificationnumber' | 'netvisorkey';
      defaultDimensionHandlingType?: 'none' | 'usedefault';
    };
  };
  /** Use either workdayHour or workdayTime property */
  workdayHour?: {
    hours: number;
    collectorRatio: {
      value: string;
      attr: { type: 'number' };
    };
    acceptanceStatus: 'confirmed' | 'accepted';
    description: string;
    crmProcessIdentifier?: {
      value: string;
      attr: { billingtype: 'billable' | 'unbillable' };
    };
    invoicingProductIdentifier?: string;
    customerIdentifier?: {
      value: string;
      attr: { type: 'netvisor' | 'customer' };
    };
    dimension?: {
      dimensionName: string;
      dimensionItem: string | { value: string; attr: { fatherid: number } };
    }[];
  }[];
  /** Use either workdayHour or workdayTime property */
  workdayTime?: {
    /** HH:mm */
    startTimeOfDay: string;
    /** HH:mm */
    endTimeOfDay: string;
    breakTime: {
      value: number;
      attr: { type: 'minutes' };
    };
    collectorRatio: {
      value: string;
      attr: { type: 'number' };
    };
    acceptanceStatus: 'confirmed' | 'accepted';
    description: string;
    invoicingProductIdentifier?: string;
    dimension?: {
      dimensionName: string;
      dimensionItem: string;
    }[];
  }[];
}

/*
 * RESOURCE
 * getrecordtypelist.nv
 */

export interface GetRecordTypeItem {
  names: {
    name: GetRecordTypeItemName[];
  };
  netvisorKey: number;
  ratioNumber: number;
  /** 1=Tuntikirjaus, 2= Vuosiloma, 5=Muu poissaolo */
  characterType: number;
  /** 1=Tunti, 2=Päivä */
  unitType: number;
}

export interface GetRecordTypeItemName {
  value: string;
  attr: { 'iso639-1code': string };
}
