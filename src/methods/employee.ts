import { NetvisorApiClient } from '..';
import { NetvisorMethod } from './_method';
import * as js2xmlparser from 'js2xmlparser';

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
    employeebaseinformation?: {
      foreignemployeeidentification?: {
        identifier: { '@': { type: string }; '#': string };
        issuingcountry: { '@': { type: string }; '#': string };
        gender: string;
        dateofbirth: string;
      };
      employeeidentifier?: string;
      firstname?: string;
      lastname?: string;
      phonenumber?: string;
      email?: string;
      [key: string]: any;
    };
    employeepayrollinformation?: {
      streetaddress?: string;
      postnumber?: string;
      city?: string;
      country?: string;
      nationality?: string;
      language?: string;
      employeenumber?: string;
      payrollrulegroupname?: string;
      bankaccountnumber?: string;
      bankidentificationcode?: string;
      accountingaccountnumber?: string;
      hierarchy?: { '@': { type: string }; '#': string };
      dimension?: Dimensions;
      payslipdeliverymethod?: { '@': { type: string }; '#': string };
      employeeinsurancetype?: string;
      [key: string]: any;
    };
    employmentperiods?: {
      employmentperiod?: {
        startdate?: { '@': { format: string }; '#': string };
        profession?: string;
        occupationclassification?: { '@': { type: string }; '#': string };
        groundsforemployment?: string;
        [key: string]: any;
      };
    }[];
    employeesettings?: EmployeeSettings;
    employeesettlementpoints?: EmployeeSettlementPoints;
  };
}

export class NetvisorEmployeeMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);

    this._endpointUri = 'employee.nv';
  }

  /**
   * Save employee data
   * @param dataset as IEmployee
   * @param params use { method: 'add' } or { method: 'edit' }
   */
  async saveEmployeeByDataSet(dataset: IEmployee, params: Method) {
    const xml = js2xmlparser.parse('Root', dataset);

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''), params);
  }
}
