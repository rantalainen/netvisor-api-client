/*
 * RESOURCE
 * customerlist.nv
 */

export interface CustomerListParameters {
  /**
   * Suodattaa listaa annetulla keywordillä. Palauttaa listalle ne asiakkaat, joilta löytyy keyword.
   * Osumaa etsitään kentistä Nimi, Asiakasnumero, Y-tunnus, CoNimi. Jos keyword parametri on annettu, changedsince jätetään huomioimatta.
   */
  keyword?: string;
  /** Suodattaa asiakkuudet, joissa muutoksia annetun päivämäärän jälkeen. Päivämäärä muodossa YYYY-MM-DDTHH:mm:ss */
  changedSince?: string;
  /**
   * Pilkkueroteltu lista asiakaskoodeja, jonka mukaan suodattaa palautettavat asiakkaat. Lista saa sisältää enintään 100 alfanumeerista asiakaskoodia.
   * Huom! Keyword-parametrin voi antaa customercodelist-parametrin kanssa. Tällöin resurssi palauttaa ne asiakkaat, joilla on listalta löytyvä asiakaskoodi
   * JA keyword jossain keywordin etsimässä kentässä.
   */
  customerCodeList?: string;
}

export interface CustomerListItem {
  netvisorKey: number;
  name: string;
  code: string;
  organisationIdentifier: string;
  customerGroupID: number | null;
  customerGroupName: string;
  uri: string;
}

/*
 * RESOURCE
 * getcustomer.nv
 */

export interface GetCustomerParameters {
  /** Haettavan asiakkaan NetvisorKey eli ID */
  id?: number;
  /** Palauttaa yhdessä pyynnössä täydet tiedot kaikista halutuista asiakkaista, max. 500 ID:tä */
  idList?: string;
  /** Palauttaa tiedot asiakkaan myyntisaamisten kiertoajoista */
  replyOption?: 1;
}

export interface GetCustomer {
  customerBaseInformation: {
    netvisorKey: number;
    internalIdentifier: string;
    externalIdentifier: string;
    organizationUnitNumber?: number;
    customerGroupNetvisorKey?: string;
    customerGroupName?: string;
    name: string;
    nameExtension: string;
    streetAddress: string;
    additionalStreetAddress: string;
    city: string;
    postNumber: string;
    country?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    phoneNumber: string;
    faxNumber: string;
    email: string;
    emailInvoicingAddress: string;
    homePageUri: string;
    isActive: number;
    isPrivateCustomer: number;
  };
  customerFinvoiceDetails: {
    finvoiceAddress: string;
    finvoiceRouterCode: string;
  };
  customerDeliveryDetails: {
    deliveryName: string;
    deliveryStreetAddress: string;
    deliveryCity: string;
    deliveryPostNumber: string;
    deliveryCountry?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
  };
  customerContactDetails: {
    contactPerson: string;
    contactPersonEmail: string;
    contactPersonPhone: string;
  };
  customerContactPersons?: {
    contactPersonID: number;
    contactPersonFirstName: string;
    contactPersonLastName: string;
    contactPersonPhoneNumber: string;
    contactPersonEmail: string;
    contactPersonOfficeNetvisorKey: number;
  }[];
  customerOfficeDetails?: {
    officeNetvisorKey: number;
    officeName: string;
    officePhoneNumber: string;
    officeTelefaxNumber: string;
    officeIdentifier: string;
    officeContactAddress: {
      streetAddress?: string;
      postNumber?: string;
      city?: string;
      country?: string;
    };
    officeVisitAddress: {
      streetAddress?: string;
      postNumber?: string;
      city?: string;
      country?: string;
    };
    officeFinvoiceDetails: {
      finvoiceAddress?: string;
      finvoiceRouterCode?: string;
    };
  }[];
  customerAdditionalInformation: {
    comment: string;
    customerAgreementIdentifier: string;
    referenceNumber: string;
    useCreditorReferenceNumber: number;
    yourDefaultReference: string;
    defaultTextBeforeInvoiceLines: string;
    defaultTextAfterInvoiceLines: string;
    defaultPaymentTerm: {
      value: string;
      attr: { netvisorkey: string };
    };
    taxHandlingType: string;
    balanceLimit: number | null;
    defaultSalesPerson?: string;
    discountPercentage?: number;
    priceGroup?: string;
    factoringAccount?: {
      value: string;
      attr: { netvisorkey: string };
    };
    invoicingLanguage?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    euStandardFinvoice: number;
    customerDimensions?: {
      dimension: {
        dimensionName: {
          value: string;
          attr: { netvisorkey: string };
        };
        dimensionItem: {
          value: string;
          attr: { netvisorkey: string };
        };
      }[];
    };
    additionalInformation?: {
      receivablesManagement: {
        turnoverDays: string;
        turnoverDeviation: string;
      };
    };
  };
}

/*
 * RESOURCE
 * customer.nv
 */

export interface CustomerParameters {
  method: 'add' | 'edit';
  id?: number;
}

export interface Customer {
  customerBaseInformation?: {
    /** Use attribute 'automatic' if you want Netvisor to use next free customer number */
    internalIdentifier?:
      | string
      | {
          attr?: { type: 'automatic' };
        };
    externalIdentifier?: string;
    organizationUnitNumber?: number;
    name?: string;
    nameExtension?: string;
    streetAddress?: string;
    additionalAddressLine?: string;
    city?: string;
    postNumber?: string;
    country?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    customerGroupName?: string;
    phoneNumber?: string;
    faxNumber?: string;
    email?: string;
    homepageUri?: string;
    isActive?: 0 | 1;
    isPrivateCustomer?: 0 | 1;
    emailInvoicingAddress?: string;
  };
  customerFinvoiceDetails?: {
    finvoiceAddress?: string;
    finvoiceRouterCode?: string;
  };
  customerDeliveryDetails?: {
    deliveryName?: string;
    deliveryStreetAddress?: string;
    deliveryCity?: string;
    deliveryPostNumber?: string;
    deliveryCountry?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
  };
  customerContactDetails?: {
    contactName?: string;
    contactPerson?: string;
    contactPersonEmail?: string;
    contactPersonPhone?: string;
  };
  customerAdditionalInformation?: {
    comment?: string;
    customerAgreementIdentifier?: string;
    customerReferenceNumber?: string;
    invoicingLanguage?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    /** 1 = Lasku + tilisiirto; 2 = Lasku */
    invoicePrintChannelFormat?: {
      value: 1 | 2;
      attr: { type: 'netvisor' };
    };
    yourDefaultReference?: string;
    defaultTextBeforeInvoiceLines?: string;
    defaultTextAfterInvoiceLines?: string;
    defaultPaymentTerm?: {
      value: string;
      attr: { type: 'netvisor' | 'customer' };
    };
    defaultSecondName?: {
      value: string;
      attr: { type: 'netvisor' | 'customer' };
    };
    paymentInterest?: number;
    balanceLimit?: number;
    receivablesManagementAutomationRule?: {
      value: string;
      attr: { type: 'netvisor' | 'customer' };
    };
    factoringAccount?: {
      value: string;
      attr: { type: 'netvisor' | 'customer' };
    };
    taxHandlingType?: 'countrygroup' | 'forcedomestic' | 'notaxhandling' | 'domesticconstructionservice';
    euStandardFinvoice?: 0 | 1;
    defaultSalesPerson?: {
      salesPersonId?: {
        value: string;
        attr: { type: 'netvisor' };
      };
    };
  };
  customerDimensionDetails?: {
    dimension: {
      dimensionName: string;
      dimensionItem: string;
    }[];
  };
}

/*
 * RESOURCE
 * office.nv
 */

export interface OfficeParameters {
  method: 'add' | 'edit';
  customerId: number;
  officeId?: number;
}

export interface Office {
  name: string;
  phoneNumber?: string;
  telefaxNumber?: string;
  officeIdentifier?: string;
  emailInvoicingAddress?: string;
  officeContactAddress?: {
    streetAddress: string;
    postNumber: string;
    city: string;
    country?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
  };
  officeVisitAddress?: {
    streetAddress: string;
    postNumber: string;
    city: string;
    country?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
  };
  officeFinvoiceDetails?: {
    finvoiceAddress: string;
    finvoiceRouterCode: string;
  };
}

/*
 * RESOURCE
 * contactperson.nv
 */

export interface ContactPerson {
  method: 'add' | 'edit' | 'delete';
  customerIdentifier: {
    value: number;
    attr: {
      type: 'netvisor';
    };
  };
  contactPersonIdentifier?: {
    value: string;
    attr: {
      type: 'netvisor';
    };
  };
  isDefault?: string;
  firstName: string;
  lastName: string;
  language: {
    value: 'FI' | 'EN' | 'SE';
    attr: { type: 'ISO-3166' };
  };
  phoneNumber?: number;
  email?: string;
  title?: string;
  officeIdentifier?: {
    value: string;
    attr: {
      type: 'netvisor';
    };
  };
  positionIdentifier?: {
    value: string;
    attr: {
      type: 'netvisor';
    };
  };
  contactPersonAddress?: {
    streetAddress?: string;
    postNumber?: number;
    city?: string;
    country?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
  };
}

/*
 * RESOURCE
 * salespersonnellist.nv
 */

export interface SalesPersonnelListItem {
  netvisorKey: number;
  firstName: string;
  lastName: string;
  provisionPercent?: number;
}
