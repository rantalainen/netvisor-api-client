export interface ICustomerList {
  netvisorKey: string;
  name: string;
  code: string;
  externalidentifier: string;
  param?: any;
}

export interface ICustomer {
  customer: {
    customerbaseinformation: {
      internalidentifier: string;
      externalidentifier?: string;
      name: string;
      streetaddress: string;
      city: string;
      postnumber: string;
      country: {
        '@': { type: string };
        '#': string;
      };
      emailinvoicingaddress?: string;

      param?: any;
    };

    customerfinvoicedetails?: {
      finvoiceaddress: string;
      finvoiceroutercode: string;
    };

    param?: any;
  };
}

export interface INvCustomer {
  customerBaseInformation: {
    NetvisorKey?: string;
    InternalIdentifier?: string;
    ExternalIdentifier?: string;
    OrganizationUnitNumber?: string;
    Name?: string;
    NameExtension?: string;
    StreetAddress?: string;
    AdditionalStreetAddress?: string;
    City?: string;
    PostNumber?: string;
    Country?: string;
    Email?: string;
    EmailInvoicingAddress?: string;
    IsActive?: string;

    [param: string]: any;
  };

  customerFinvoiceDetails: {
    FinvoiceAddress?: string;
    FinvoiceRouterCode?: string;
  };

  customerAdditionalInformation: {
    Comment?: string;
    PriceGroup?: string;
    InvoicingLanguage?: string;

    [param: string]: any;
  };

  [param: string]: any;
}
