type Method = {
  method: 'add' | 'edit';
};
type Dimensions = {
  dimensionname: string;
  dimensionitem: string;
};
type EmployeeSettings = {
  payrollservice?: 'enabled' | 'disabled';
  resourcemanagement?: 'enabled' | 'disabled';
};
type EmployeeSettlementPoints = {
  employeeworkpensioninsurance?: SettlementPoint;
  employeeunemploymentinsurance?: SettlementPoint;
  employeeaccidentinsurance?: SettlementPoint;
  employeegrouplifeinsurance?: SettlementPoint;
  employeeunionmembershipfee?: SettlementPoint;
  employeeforeclosure?: SettlementPoint;
};
type SettlementPoint = { type: string; name: string };

export interface IEmployee {
  employee: {
    employeebaseinformation: {
      foreignemployeeidentification?: {
        identifier: { '@': { type: string }; '#': string };
        issuingcountry: { '@': { type: string }; '#': string };
        gender: string;
        dateofbirth: string;
      };
      employeeidentifier?: string;
      firstname: string;
      lastname: string;
      phonenumber: string;
      email: string;
    };
    employeepayrollinformation: {
      streetaddress: string;
      postnumber: string;
      city: string;
      country?: string;
      nationality?: string;
      language?: string;
      employeenumber?: string;
      payrollrulegroupname: string;
      bankaccountnumber?: string;
      bankidentificationcode?: string;
      accountingaccountnumber?: string;
      hierarchy?: { '@': { type: string }; '#': string };
      dimension?: Dimensions;
      payslipdeliverymethod?: { '@': { type: string }; '#': string };
      employeeinsurancetype?: string;
    };
    employmentperiods?: {
      employmentperiod?: {
        startdate?: { '@': { format: string }; '#': string };
        profession?: string;
        occupationclassification?: { '@': { type: string }; '#': string };
        groundsforemployment?: string;
      };
    }[];
    employeesettings?: EmployeeSettings;
    employeesettlementpoints?: EmployeeSettlementPoints;
  };
}
