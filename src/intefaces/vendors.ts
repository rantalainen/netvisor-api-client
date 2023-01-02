export interface IVendor {
  NetvisorKey: string;
  VendorBaseInformation: {
    Code: string;
    Name: string;
    Address: string;
    PostCode: string;
    City: string;
    Country: string;
    OrganizationId: string;
    GroupName: string;
    VendorBankAccounts: any;
  };
  VendorContactDetails: {
    PhoneNumber: string;
    Email: string;
    FaxNumber: string;
    ContactPersonName: string;
    ContactPersonPhoneNumber: string;
    ContactPersonEmail: string;
    HomePage: string;
    Comment: string;
  };
  VendorAdditionalInformation: {
    DefaultVatPercent: string;
    IsPartialVatReducePrivileged: string;
    PaymentTerm: string;
  };
}
