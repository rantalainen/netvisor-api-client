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
    // Reorganize dataset object to meet Netvisor xml format requirements

    const baseinformation = !dataset.employee.employeebaseinformation.foreignemployeeidentification
      ? {
          employeeidentifier: dataset.employee.employeebaseinformation.employeeidentifier,
          firstname: dataset.employee.employeebaseinformation.firstname,
          lastname: dataset.employee.employeebaseinformation.lastname,
          phonenumber: dataset.employee.employeebaseinformation.phonenumber,
          email: dataset.employee.employeebaseinformation.email
        }
      : {
          foreignemployeeidentification: dataset.employee.employeebaseinformation.foreignemployeeidentification,
          firstname: dataset.employee.employeebaseinformation.firstname,
          lastname: dataset.employee.employeebaseinformation.lastname,
          phonenumber: dataset.employee.employeebaseinformation.phonenumber,
          email: dataset.employee.employeebaseinformation.email
        };

    const payrollinformation: any = {
      streetaddress: dataset.employee.employeepayrollinformation.streetaddress,
      postnumber: dataset.employee.employeepayrollinformation.postnumber,
      city: dataset.employee.employeepayrollinformation.city
    };

    if (!!dataset.employee.employeepayrollinformation.country) {
      payrollinformation.country = dataset.employee.employeepayrollinformation.country;
    }
    if (!!dataset.employee.employeepayrollinformation.nationality) {
      payrollinformation.nationality = dataset.employee.employeepayrollinformation.nationality;
    }
    if (!!dataset.employee.employeepayrollinformation.language) {
      payrollinformation.language = dataset.employee.employeepayrollinformation.language;
    }
    if (!!dataset.employee.employeepayrollinformation.employeenumber) {
      payrollinformation.employeenumber = dataset.employee.employeepayrollinformation.employeenumber;
    }

    payrollinformation.payrollrulegroupname = dataset.employee.employeepayrollinformation.payrollrulegroupname;

    if (!!dataset.employee.employeepayrollinformation.bankaccountnumber) {
      payrollinformation.bankaccountnumber = dataset.employee.employeepayrollinformation.bankaccountnumber;
    }
    if (!!dataset.employee.employeepayrollinformation.bankidentificationcode) {
      payrollinformation.bankidentificationcode = dataset.employee.employeepayrollinformation.bankidentificationcode;
    }
    if (!!dataset.employee.employeepayrollinformation.accountingaccountnumber) {
      payrollinformation.accountingaccountnumber = dataset.employee.employeepayrollinformation.accountingaccountnumber;
    }
    if (!!dataset.employee.employeepayrollinformation.hierarchy) {
      payrollinformation.hierarchy = dataset.employee.employeepayrollinformation.hierarchy;
    }
    if (!!dataset.employee.employeepayrollinformation.dimension) {
      payrollinformation.dimension = dataset.employee.employeepayrollinformation.dimension;
    }
    if (!!dataset.employee.employeepayrollinformation.payslipdeliverymethod) {
      payrollinformation.payslipdeliverymethod = dataset.employee.employeepayrollinformation.payslipdeliverymethod;
    }
    if (!!dataset.employee.employeepayrollinformation.employeeinsurancetype) {
      payrollinformation.employeeinsurancetype = dataset.employee.employeepayrollinformation.employeeinsurancetype;
    }

    const organizedData: IEmployee = {
      employee: {
        employeebaseinformation: baseinformation,
        employeepayrollinformation: payrollinformation
      }
    };

    if (!!dataset.employee.employmentperiods) {
      organizedData.employee.employmentperiods = dataset.employee.employmentperiods;
    }
    if (!!dataset.employee.employeesettings) {
      organizedData.employee.employeesettings = dataset.employee.employeesettings;
    }
    if (!!dataset.employee.employeesettlementpoints) {
      organizedData.employee.employeesettlementpoints = dataset.employee.employeesettlementpoints;
    }

    const xml = js2xmlparser.parse('Root', organizedData);

    return await this._client.post(this._endpointUri, xml.replace("<?xml version='1.0'?>", ''), params);
  }

  /**
   * Fetch employee salary parameters as xml
   * @param employeeId as social security no or employee number
   * @param identifiertype optional, defaults as 'pin' for social security no, use 'number' for employee number
   */
  async getEmployeeSalaryParameters(employeeId: string, identifiertype = 'pin') {
    return await this._client.get('getemployeesalaryparameters.nv', { identifiertype, identifier: employeeId });
  }
}
