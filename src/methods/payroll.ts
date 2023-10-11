import { NetvisorApiClient } from '..';
import { NetvisorMethod, forceArray, parseXml, buildXml } from './_method';
import {
  AddJobPeriod,
  AddJobPeriodParameters,
  AttachEmployeeToSettlementPoint,
  AttachEmployeeToSettlementPointParameters,
  DeleteJobPeriodParameters,
  EditJobPeriod,
  EditJobPeriodParameters,
  Employee,
  EmployeeParameters,
  EmployeeSalaryParameters,
  GetEmployee,
  GetEmployeeAdditionalInformationField,
  GetEmployeeEmploymentPeriod,
  GetEmployeeParameters,
  GetEmployeeSalaryParametersItem,
  GetEmployeeSalaryParametersParams,
  GetEmployeesItem,
  GetEmployeesParameters,
  GetPayrollPartiesItem,
  GetPayrollPaycheckBatch,
  GetPayrollPaycheckBatchAllocationCurve,
  GetPayrollPaycheckBatchListItem,
  GetPayrollPaycheckBatchListParameters,
  GetPayrollPaycheckBatchParameters,
  GetPayrollPaycheckBatchPayrollLine,
  PatchEmployee,
  PatchEmployeeParameters,
  PayrollAdvance,
  PayrollExternalSalaryPayment,
  PayrollPaycheckBatch,
  PayrollPeriodCollector,
  PayrollRatioListItem,
  PayrollRatioListParameters
} from '../interfaces/payroll';
import * as xml2js from 'xml2js';

// Use class specific parser (charkey = val instead of value)
// This is because there are some attributes with name 'value' in the xml and this confuses the parser
function employeeParseXml(xml: string): any {
  const xmlParser = new xml2js.Parser({
    attrkey: 'attr',
    charkey: 'val',
    explicitArray: false,
    normalizeTags: true,
    attrNameProcessors: [(name) => name.toLowerCase()]
  });
  let xmlObject: any;
  xmlParser.parseString(xml, (error: any, result: any) => {
    const responseStatus = result?.root?.responsestatus?.status;
    if (responseStatus === 'OK') {
      xmlObject = result.root;
      delete xmlObject.responsestatus;
    }
  });
  return xmlObject;
}

// Use class specific builder (charkey = val instead of value)
// This is because there are some attributes with name 'value' in the xml and this confuses the builder
export function employeeBuildXml(obj: Object): string {
  const xmlBuilder = new xml2js.Builder({ attrkey: 'attr', charkey: 'val', headless: true });
  const xmlString: string = xmlBuilder.buildObject(obj);
  return xmlString;
}

export class NetvisorPayrollMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Create a new payroll period collector to Netvisor
   * @example await payrollPeriodCollector(collectorData);
   */
  async payrollPeriodCollector(collector: PayrollPeriodCollector): Promise<void> {
    await this._client.post('payrollperiodcollector.nv', buildXml({ root: { payrollperiodcollector: collector } }));
  }

  /**
   * Get employee list from Netvisor
   * @example await getEmployees();
   */
  async getEmployees(params?: GetEmployeesParameters): Promise<GetEmployeesItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getemployees.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const employees: GetEmployeesItem[] = [];
    // Add items to return array
    if (xmlObject.employees?.employee) {
      forceArray(xmlObject.employees.employee).forEach((employee: any) => {
        employees.push({
          employeeNumber: parseInt(employee.employeenumber) || undefined,
          netvisorKey: parseInt(employee.netvisorkey),
          personalId: employee.personalid,
          firstName: employee.firstname,
          lastName: employee.lastname,
          realName: employee.realname,
          employmentStatus: employee.employmentstatus === '1' ? true : false,
          payrollService: employee.payrollservice === '1' ? true : false,
          resourceManagement: employee.resourcemanagement === '1' ? true : false
        });
      });
    }
    return employees;
  }

  /**
   * Get a single employee from Netvisor
   * @example await getEmployee();
   */
  async getEmployee(params?: GetEmployeeParameters): Promise<GetEmployee> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getemployee.nv', params);
    // Parse the xml to js object
    const xmlObject: any = employeeParseXml(responseXml);

    const employee: GetEmployee = {
      employeeBaseInformation: {
        netvisorKey: parseInt(xmlObject.employee.employeebaseinformation.netvisorkey),
        employeeNumber: parseInt(xmlObject.employee.employeebaseinformation.employeenumber) || undefined,
        employeeIdentifier: {
          value: xmlObject.employee.employeebaseinformation.employeeidentifier.val,
          attr: xmlObject.employee.employeebaseinformation.employeeidentifier.attr
        },
        foreignIdentifierType: xmlObject.employee.employeebaseinformation.foreignidentifiertype || undefined,
        firstName: xmlObject.employee.employeebaseinformation.firstname,
        lastName: xmlObject.employee.employeebaseinformation.lastname,
        fullName: xmlObject.employee.employeebaseinformation.fullname,
        payrollService: xmlObject.employee.employeebaseinformation.payrollservice === '1' ? true : false,
        resourceManagement: xmlObject.employee.employeebaseinformation.resourcemanagement === '1' ? true : false,
        nationality: {
          value: xmlObject.employee.employeebaseinformation.nationality.val,
          attr: xmlObject.employee.employeebaseinformation.nationality.attr
        },
        language: {
          value: xmlObject.employee.employeebaseinformation.language.val,
          attr: xmlObject.employee.employeebaseinformation.language.attr
        },
        gender: xmlObject.employee.employeebaseinformation.gender,
        dateOfBirth: xmlObject.employee.employeebaseinformation.dateofbirth,
        streetAddress: xmlObject.employee.employeebaseinformation.streetaddress,
        postNumber: xmlObject.employee.employeebaseinformation.postnumber,
        city: xmlObject.employee.employeebaseinformation.city,
        country: {
          value: xmlObject.employee.employeebaseinformation.country.val,
          attr: xmlObject.employee.employeebaseinformation.country.attr
        },
        activity: xmlObject.employee.employeebaseinformation.activity === '1' ? true : false
      }
    };

    // Optional base information attributes
    if (xmlObject.employee.employeebaseinformation.issuingcountry?.val) {
      employee.employeeBaseInformation.issuingCountry = {
        value: xmlObject.employee.employeebaseinformation.issuingcountry.val,
        attr: xmlObject.employee.employeebaseinformation.issuingcountry.attr
      };
    }
    if (xmlObject.employee.employeebaseinformation.municipality) {
      employee.employeeBaseInformation.municipality = xmlObject.employee.employeebaseinformation.municipality;
    }
    if (xmlObject.employee.employeebaseinformation.phonenumber) {
      employee.employeeBaseInformation.phoneNumber = xmlObject.employee.employeebaseinformation.phonenumber;
    }
    if (xmlObject.employee.employeebaseinformation.email) {
      employee.employeeBaseInformation.email = xmlObject.employee.employeebaseinformation.email;
    }
    if (xmlObject.employee.employeebaseinformation.bankaccountnumber) {
      employee.employeeBaseInformation.bankAccountNumber = xmlObject.employee.employeebaseinformation.bankaccountnumber;
    }
    if (xmlObject.employee.employeebaseinformation.bankidentificationcode) {
      employee.employeeBaseInformation.bankIdentificationCode = xmlObject.employee.employeebaseinformation.bankidentificationcode;
    }

    // Employment periods
    if (xmlObject.employee.employmentperiods) {
      employee.employmentPeriods = [];
      forceArray(xmlObject.employee.employmentperiods.employmentperiod).forEach((period: any) => {
        // Create the employment period object with required attributes
        const employeePeriod: GetEmployeeEmploymentPeriod = {
          netvisorKey: parseInt(period.netvisorkey),
          startDate: {
            value: period.startdate.val,
            attr: period.startdate.attr
          },
          profession: period.profession,
          groundsForEmployment: parseInt(period.groundsforemployment),
          isPaymentTypeMonthlyWage: period.ispaymenttypemonthlywage === '1' ? true : false,
          isPaymentTypeHourlyWage: period.ispaymenttypehourlywage === '1' ? true : false,
          isPaymentTypePieceWage: period.ispaymenttypepiecewage === '1' ? true : false,
          stateEmploymentFund: period.stateemploymentfund === '1' ? true : false,
          isAbroadCarBenefit: period.isabroadcarbenefit === '1' ? true : false
        };

        // Add optional employment period attributes
        if (period.companystartdate?.val) {
          employeePeriod.companyStartDate = {
            value: period.companystartdate.val,
            attr: period.companystartdate.attr
          };
        }
        if (period.probationenddate?.val) {
          employeePeriod.probationEndDate = {
            value: period.probationenddate.val,
            attr: period.probationenddate.attr
          };
        }
        if (period.employmentmode?.val) {
          employeePeriod.employmentMode = {
            value: parseInt(period.employmentmode.val),
            attr: period.employmentmode.attr
          };
        }
        if (period.comment) employeePeriod.comment = period.comment;
        if (period.enddate?.val) {
          employeePeriod.endDate = {
            value: period.enddate.val,
            attr: period.enddate.attr
          };
        }
        if (period.endreason?.val) {
          employeePeriod.endReason = {
            value: parseInt(period.endreason.val),
            attr: period.endreason.attr
          };
        }
        if (period.occupationclassification?.val) {
          employeePeriod.occupationClassification = {
            value: period.occupationclassification.val,
            attr: period.occupationclassification.attr
          };
        }
        if (period.employmentcontract?.val) {
          employeePeriod.employmentContract = {
            value: parseInt(period.employmentcontract.val),
            attr: period.employmentcontract.attr
          };
        }
        if (period.employmentform?.val) {
          employeePeriod.employmentForm = {
            value: parseInt(period.employmentform.val),
            attr: period.employmentform.attr
          };
        }
        if (period.parttimepercent) employeePeriod.partTimePercent = parseFloat(period.parttimepercent.replace(',', '.'));
        if (period.regularworkinghours) employeePeriod.regularWorkingHours = parseFloat(period.regularworkinghours.replace(',', '.'));
        if (period.kevaprofessionalclasscode) employeePeriod.kevaProfessionalClassCode = period.kevaprofessionalclasscode;
        if (period.kevaemploymentregistration.val) {
          employeePeriod.kevaEmploymentRegistration = {
            value: period.kevaemploymentregistration.val,
            attr: period.kevaemploymentregistration.attr
          };
        }
        if (period.collectiveagreement?.val) {
          employeePeriod.collectiveAgreement = {
            value: parseInt(period.collectiveagreement.val),
            attr: period.collectiveagreement.attr
          };
        }
        if (period.carbenefityear) employeePeriod.carBenefitYear = parseInt(period.carbenefityear);
        if (period.caremissionvalue) employeePeriod.carEmissionValue = parseFloat(period.caremissionvalue.replace(',', '.'));

        // Push the object to the array
        employee.employmentPeriods!.push(employeePeriod);
      });
    }

    // Employee payroll information
    if (xmlObject.employee.employeepayrollinformation) {
      const payrollInfo = xmlObject.employee.employeepayrollinformation;
      // Create the payroll information object with required attributes
      employee.employeePayrollInformation = {
        foreclosure: payrollInfo.foreclosure === '1' ? true : false,
        noSocialSecurityPayment: payrollInfo.nosocialsecuritypayment === '1' ? true : false,
        accountingAccount: {
          netvisorKey: parseInt(payrollInfo.accountingaccount.netvisorkey),
          name: payrollInfo.accountingaccount.name,
          number: parseInt(payrollInfo.accountingaccount.number)
        },
        hierarchy: {
          netvisorKey: parseInt(payrollInfo.hierarchy.netvisorkey),
          name: payrollInfo.hierarchy.name
        },
        payslipDeliveryMethod: {
          value: parseInt(payrollInfo.payslipdeliverymethod.val),
          attr: payrollInfo.payslipdeliverymethod.attr
        },
        isJointOwner: payrollInfo.isjointowner === '1' ? true : false,
        isAthlete: payrollInfo.isathlete === '1' ? true : false,
        isPerformingArtist: payrollInfo.isperformingartist === '1' ? true : false,
        isPersonWorkingOnARoadFerryOnALandIslands: payrollInfo.ispersonworkingonaroadferryonalandislands === '1' ? true : false,
        isEntrepreneurWithOptionalYelOrMyel: payrollInfo.isentrepreneurwithoptionalyelormyel === '1' ? true : false
      };

      // Add optional payroll information attributes
      if (payrollInfo.payrollrulegroup) {
        employee.employeePayrollInformation.payrollRuleGroup = {
          netvisorKey: parseInt(payrollInfo.payrollrulegroup.netvisorkey),
          name: payrollInfo.payrollrulegroup.name
        };
      }
      if (payrollInfo.taxnumber) employee.employeePayrollInformation.taxNumber = payrollInfo.taxnumber;
      if (payrollInfo.foreclosuremaintenancepersons) {
        employee.employeePayrollInformation.foreclosureMaintenancePersons = parseInt(payrollInfo.foreclosuremaintenancepersons);
      }
      if (payrollInfo.placeofbusiness) employee.employeePayrollInformation.placeOfBusiness = payrollInfo.placeofbusiness;
      if (payrollInfo.defaultdimensions) {
        employee.employeePayrollInformation!.defaultDimensions = { defaultDimension: [] };
        forceArray(payrollInfo.defaultdimensions.defaultdimension).forEach((dimension: any) => {
          employee.employeePayrollInformation!.defaultDimensions!.defaultDimension.push(dimension);
        });
      }
      if (payrollInfo.employeeinsurancetype) {
        employee.employeePayrollInformation.employeeInsuranceType = parseInt(payrollInfo.employeeinsurancetype);
      }
    }

    // Employee educational information
    if (xmlObject.employee.employeeeducationalinformation) {
      employee.employeeEducationalInformation = { degree: [] };
      forceArray(xmlObject.employee.employeeeducationalinformation.degree).forEach((degree: any) => {
        employee.employeeEducationalInformation!.degree!.push({
          name: degree.name,
          school: degree.school || undefined,
          graduationYear: parseInt(degree.graduationyear) || undefined,
          isPrimaryDegree: degree.isprimarydegree === '1' ? true : false
        });
      });
    }

    // Employee additional information fields
    if (xmlObject.employee.employeeadditionalinformationfields) {
      employee.employeeAdditionalInformationFields = { additionalInformationField: [] };
      forceArray(xmlObject.employee.employeeadditionalinformationfields.additionalinformationfield).forEach((field: any) => {
        const informationField: GetEmployeeAdditionalInformationField = {
          name: field.name,
          group: {
            value: parseInt(field.group.val),
            attr: field.group.attr
          }
        };
        if (field.netvisorkey) informationField.netvisorKey = parseInt(field.netvisorkey);
        if (field.value?.val) {
          informationField.value = {
            value: field.value.val,
            attr: field.value.attr
          };
        }

        employee.employeeAdditionalInformationFields!.additionalInformationField!.push(informationField);
      });
    }

    // Employee settlement points
    if (xmlObject.employee.employeesettlementpoints) {
      employee.employeeSettlementPoints = {};
      const settlementPoints = xmlObject.employee.employeesettlementpoints;
      // Pension insurances
      if (settlementPoints.employeeworkpensioninsurance) {
        employee.employeeSettlementPoints.employeeWorkPensionInsurance = [];
        forceArray(settlementPoints.employeeworkpensioninsurance).forEach((insurance: any) => {
          employee.employeeSettlementPoints!.employeeWorkPensionInsurance!.push({
            netvisorKey: parseInt(insurance.netvisorkey),
            type: insurance.type,
            name: insurance.name
          });
        });
      }
      // Unemployment insurances
      if (settlementPoints.employeeunemploymentinsurance) {
        employee.employeeSettlementPoints.employeeUnemploymentInsurance = [];
        forceArray(settlementPoints.employeeunemploymentinsurance).forEach((insurance: any) => {
          employee.employeeSettlementPoints!.employeeUnemploymentInsurance!.push({
            netvisorKey: parseInt(insurance.netvisorkey),
            type: insurance.type,
            name: insurance.name
          });
        });
      }
      // Accident insurances
      if (settlementPoints.employeeaccidentinsurance) {
        employee.employeeSettlementPoints.employeeAccidentInsurance = [];
        forceArray(settlementPoints.employeeaccidentinsurance).forEach((insurance: any) => {
          employee.employeeSettlementPoints!.employeeAccidentInsurance!.push({
            netvisorKey: parseInt(insurance.netvisorkey),
            type: insurance.type,
            name: insurance.name
          });
        });
      }
      // Group life insurances
      if (settlementPoints.employeegrouplifeinsurance) {
        employee.employeeSettlementPoints.employeeGroupLifeInsurance = [];
        forceArray(settlementPoints.employeegrouplifeinsurance).forEach((insurance: any) => {
          employee.employeeSettlementPoints!.employeeGroupLifeInsurance!.push({
            netvisorKey: parseInt(insurance.netvisorkey),
            type: insurance.type,
            name: insurance.name
          });
        });
      }
      // Union memberships
      if (settlementPoints.employeeunionmembershipfee) {
        employee.employeeSettlementPoints.employeeUnionMembershipFee = [];
        forceArray(settlementPoints.employeeunionmembershipfee).forEach((insurance: any) => {
          employee.employeeSettlementPoints!.employeeUnionMembershipFee!.push({
            netvisorKey: parseInt(insurance.netvisorkey),
            type: insurance.type,
            name: insurance.name
          });
        });
      }
      // Forclosures
      if (settlementPoints.employeeforeclosure) {
        employee.employeeSettlementPoints.employeeForeclosure = [];
        forceArray(settlementPoints.employeeforeclosure).forEach((insurance: any) => {
          employee.employeeSettlementPoints!.employeeForeclosure!.push({
            netvisorKey: parseInt(insurance.netvisorkey),
            type: insurance.type,
            name: insurance.name
          });
        });
      }
      // Other insurances
      if (settlementPoints.employeeotherinsurance) {
        employee.employeeSettlementPoints.employeeOtherInsurance = [];
        forceArray(settlementPoints.employeeotherinsurance).forEach((insurance: any) => {
          employee.employeeSettlementPoints!.employeeOtherInsurance!.push({
            netvisorKey: parseInt(insurance.netvisorkey),
            type: insurance.type,
            name: insurance.name
          });
        });
      }
    }

    return employee;
  }

  /**
   * Create or edit an employee in Netvisor.
   * @example await employee(employee, { method: 'add' });
   */
  async employee(employee: Employee, params: EmployeeParameters): Promise<void> {
    await this._client.post('employee.nv', employeeBuildXml({ root: { employee: employee } }), params);
  }

  /**
   * Edit employee's basic information in Netvisor. Only edited properties needs to be included in the object.
   * @example await patchEmployee(employee, { identifiertype: 'netvisorkey', identifier: '123' });
   */
  async patchEmployee(employee: PatchEmployee, params: PatchEmployeeParameters): Promise<void> {
    await this._client.post('patchemployee.nv', buildXml({ root: { patchemployee: employee } }), params);
  }

  /**
   * Get employee salary parameters from Netvisor
   * @example await getEmployeeSalaryParameters({ identifierType: 'number', identifier: '1001' });
   */
  async getEmployeeSalaryParameters(params: GetEmployeeSalaryParametersParams): Promise<GetEmployeeSalaryParametersItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getemployeesalaryparameters.nv', params);
    // Parse the xml to js object
    const xmlObject: any = employeeParseXml(responseXml);
    // Create the return array
    const employeeSalaryParameters: GetEmployeeSalaryParametersItem[] = [];
    // Add items to return array
    if (xmlObject.employeeparameters?.parameters?.parameter) {
      forceArray(xmlObject.employeeparameters.parameters.parameter).forEach((xmlSalaryParam: any) => {
        // Create the paycheck batch item object
        employeeSalaryParameters.push({
          ratioNumber: parseInt(xmlSalaryParam.rationumber),
          value: parseInt(xmlSalaryParam.value)
        });
      });
    }
    return employeeSalaryParameters;
  }

  /**
   * Add, edit or remove employee's salary parameters in Netvisor. When removing a value from salary parameter, leave 'value' property empty.
   * @example await employeeSalaryParameters(salaryParameters);
   */
  async employeeSalaryParameters(salaryParameters: EmployeeSalaryParameters): Promise<void> {
    await this._client.post('employeesalaryparameters.nv', employeeBuildXml({ root: { employeesalaryparameters: salaryParameters } }));
  }

  /**
   * Get payroll ratio list from Netvisor
   * @example await payrollRatioList({ source: 'userparameters' });
   */
  async payrollRatioList(params: PayrollRatioListParameters): Promise<PayrollRatioListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('payrollratiolist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const payrollRatioList: PayrollRatioListItem[] = [];
    // Add items to return array
    if (xmlObject.payrollratios?.payrollratio) {
      forceArray(xmlObject.payrollratios.payrollratio).forEach((xmlPayrollRatio: any) => {
        // Create the paycheck batch item object
        payrollRatioList.push({
          names: {
            name: xmlPayrollRatio.names.name
          },
          identifier: {
            value: parseInt(xmlPayrollRatio.identifier.value),
            attr: xmlPayrollRatio.identifier.attr
          },
          source: {
            value: xmlPayrollRatio.source.value,
            attr: { netvisorkey: parseInt(xmlPayrollRatio.source.attr.netvisorkey) }
          },
          ratioNumber: parseInt(xmlPayrollRatio.rationumber) || undefined,
          defaultDebitAccountNumber: parseInt(xmlPayrollRatio.defaultdebitaccountnumber) || undefined,
          defaultCreditAccountNumber: parseInt(xmlPayrollRatio.defaultcreditaccountnumber) || undefined
        });
      });
    }
    return payrollRatioList;
  }

  /**
   * Create a new paycheck batch in Netvisor.
   * @example await payrollPaycheckBatch(paycheckBatch);
   * @returns Netvisor key of the created paycheck batch.
   */
  async payrollPaycheckBatch(paycheckBatch: PayrollPaycheckBatch): Promise<string> {
    const response = await this._client.post('payrollpaycheckbatch.nv', buildXml({ root: { payrollpaycheckbatch: paycheckBatch } }));
    return parseXml(response).replies.inserteddataidentifier;
  }

  /**
   * Create a new payroll or trip expense advance in Netvisor.
   * @example await payrollAdvance(advance);
   */
  async payrollAdvance(payrollAdvance: PayrollAdvance): Promise<void> {
    await this._client.post('payrolladvance.nv', buildXml({ root: { payrolladvance: payrollAdvance } }));
  }

  /**
   * Get payroll paycheck list from Netvisor
   * @example await getPayrollPaycheckBatchList({ startDate: '2023-09-01', endDate: '2023-09-30' });
   */
  async getPayrollPaycheckBatchList(params: GetPayrollPaycheckBatchListParameters): Promise<GetPayrollPaycheckBatchListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getpayrollpaycheckbatchlist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const paycheckBatchList: GetPayrollPaycheckBatchListItem[] = [];
    // Add items to return array
    if (xmlObject.payrollpaycheckbatches?.payrollpaycheckbatch) {
      forceArray(xmlObject.payrollpaycheckbatches.payrollpaycheckbatch).forEach((paycheck: any) => {
        // Create the paycheck batch item object
        const paycheckBatchItem: GetPayrollPaycheckBatchListItem = {
          netvisorKey: parseInt(paycheck.netvisorkey),
          paymentDate: paycheck.paymentdate,
          payrollRuleGroupPeriod: {
            netvisorKey: parseInt(paycheck.payrollrulegroupperiod.netvisorkey),
            startDate: paycheck.payrollrulegroupperiod.startdate,
            endDate: paycheck.payrollrulegroupperiod.enddate
          },
          payrollRuleGroup: {
            netvisorKey: parseInt(paycheck.payrollrulegroup.netvisorkey),
            name: paycheck.payrollrulegroup.name
          },
          employee: {
            name: paycheck.employee.name,
            employeeNumber: parseInt(paycheck.employee.employeenumber) || undefined,
            netvisorKey: parseInt(paycheck.employee.netvisorkey)
          },
          status: parseInt(paycheck.status),
          statusDescription: paycheck.statusdescription
        };
        // Push the object to the array
        paycheckBatchList.push(paycheckBatchItem);
      });
    }
    return paycheckBatchList;
  }

  /**
   * Get a single payroll paycheck from Netvisor
   * @example await getPayrollPaycheckBatch({ netvisorKey: '123' });
   */
  async getPayrollPaycheckBatch(params: GetPayrollPaycheckBatchParameters): Promise<GetPayrollPaycheckBatch> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getpayrollpaycheckbatch.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    const xmlPaycheck = xmlObject.payrollpaycheckbatch;
    // Create the return object with required attributes
    const paycheck: GetPayrollPaycheckBatch = {
      paymentDate: xmlPaycheck.paymentdate,
      payrollRuleGroupPeriod: {
        netvisorKey: parseInt(xmlPaycheck.payrollrulegroupperiod.netvisorkey),
        startDate: xmlPaycheck.payrollrulegroupperiod.startdate,
        endDate: xmlPaycheck.payrollrulegroupperiod.enddate
      },
      payrollRuleGroup: {
        netvisorKey: parseInt(xmlPaycheck.payrollrulegroup.netvisorkey),
        name: xmlPaycheck.payrollrulegroup.name
      },
      employee: {
        netvisorKey: parseInt(xmlPaycheck.employee.netvisorkey),
        name: xmlPaycheck.employee.name,
        employeeNumber: parseInt(xmlPaycheck.employee.employeenumber) || undefined
      },
      status: parseInt(xmlPaycheck.status),
      holidayRecords: {
        availableHolidays: parseFloat(xmlPaycheck.holidayrecords.availableholidays.replace(',', '.')),
        newAccrualOfHolidays: parseFloat(xmlPaycheck.holidayrecords.newaccrualofholidays.replace(',', '.'))
      },
      payrollPaycheckBatchLines: { payrollPaycheckBatchLine: [] }
    };

    // Add optional attributes
    if (xmlPaycheck.voucher) {
      paycheck.voucher = {
        netvisorKey: parseInt(xmlPaycheck.voucher.netvisorkey),
        class: xmlPaycheck.voucher.class,
        number: parseInt(xmlPaycheck.voucher.number),
        date: xmlPaycheck.voucher.date
      };
    }
    if (xmlPaycheck.allocationcurves) {
      paycheck.allocationCurves = { allocationCurve: [] };
      forceArray(xmlPaycheck.allocationcurves.allocationcurve).forEach((xmlCurve: any) => {
        const allocationCurve: GetPayrollPaycheckBatchAllocationCurve = {
          percent: parseFloat(xmlCurve.attr.percent.replace(',', '.')),
          dimensions: { dimension: [] }
        };
        forceArray(xmlCurve.dimensions.dimension).forEach((xmlDimension: any) => {
          allocationCurve.dimensions.dimension.push({
            dimensionName: {
              value: xmlDimension.dimensionname.value,
              attr: { netvisorKey: parseInt(xmlDimension.dimensionname.attr.netvisorkey) }
            },
            dimensionItem: {
              value: xmlDimension.dimensionitem.value,
              attr: { netvisorKey: parseInt(xmlDimension.dimensionitem.attr.netvisorkey) }
            }
          });
        });
        paycheck.allocationCurves!.allocationCurve!.push(allocationCurve);
      });
    }
    if (xmlPaycheck.freetextbeforelines) paycheck.freeTextBeforeLines = xmlPaycheck.freetextbeforelines;
    if (xmlPaycheck.freetextafterlines) paycheck.freeTextAfterLines = xmlPaycheck.freetextafterlines;

    // Add paycheck payroll lines
    if (xmlPaycheck.payrollpaycheckbatchlines?.payrollpaycheckbatchline) {
      forceArray(xmlPaycheck.payrollpaycheckbatchlines.payrollpaycheckbatchline).forEach((xmlLine: any) => {
        // Create the payroll line object with required attributes
        const paycheckLine: GetPayrollPaycheckBatchPayrollLine = {
          payrollRatio: {
            netvisorKey: parseInt(xmlLine.payrollratio.netvisorkey),
            number: parseInt(xmlLine.payrollratio.number) || undefined,
            name: xmlLine.payrollratio.name,
            isVisible: xmlLine.payrollratio.isvisible === '1' ? true : false,
            costObjectSource: xmlLine.payrollratio.costobjectsource
          },
          units: parseFloat(xmlLine.units.replace(',', '.')) || undefined,
          unitAmount: parseFloat(xmlLine.unitamount.replace(',', '.')) || undefined,
          lineSum: parseFloat(xmlLine.linesum.replace(',', '.')),
          accountingData: {
            debetAccountNetvisorKey: parseInt(xmlLine.accountingdata.debetaccountnetvisorkey) || undefined,
            debetAccountNumber: parseInt(xmlLine.accountingdata.debetaccountnumber) || undefined,
            debetAccountName: xmlLine.accountingdata.debetaccountname || undefined,
            kreditAccountNetvisorKey: parseInt(xmlLine.accountingdata.kreditaccountnetvisorkey) || undefined,
            kreditAccountNumber: parseInt(xmlLine.accountingdata.kreditaccountnumber) || undefined,
            kreditAccountName: xmlLine.accountingdata.kreditaccountname || undefined
          },
          lineDescription: xmlLine.linedescription
        };

        // Add optional attributes
        if (xmlLine.earningperiods?.earningperiod) {
          paycheckLine.earningPeriods = { earningPeriod: [] };
          forceArray(xmlLine.earningperiods.earningperiod).forEach((xmlPeriod: any) => {
            paycheckLine.earningPeriods!.earningPeriod!.push({
              startDate: xmlPeriod.startdate,
              endDate: xmlPeriod.enddate
            });
          });
        }
        if (xmlLine.incometype) {
          paycheckLine.incomeType = {
            netvisorKey: parseInt(xmlLine.incometype.netvisorkey),
            number: parseInt(xmlLine.incometype.number),
            name: xmlLine.incometype.name
          };
        }
        if (xmlLine.dimensions?.dimension) {
          paycheckLine.dimensions = { dimension: [] };
          forceArray(xmlLine.dimensions.dimension).forEach((xmlDimension: any) => {
            paycheckLine.dimensions!.dimension!.push({
              percent: parseFloat(xmlDimension.attr.percent.replace(',', '.')),
              dimensionName: {
                value: xmlDimension.dimensionname.value,
                attr: { netvisorKey: parseInt(xmlDimension.dimensionname.attr.netvisorkey) }
              },
              dimensionItem: {
                value: xmlDimension.dimensionitem.value,
                attr: { netvisorKey: parseInt(xmlDimension.dimensionitem.attr.netvisorkey) }
              }
            });
          });
        }
        paycheck.payrollPaycheckBatchLines.payrollPaycheckBatchLine.push(paycheckLine);
      });
    }

    return paycheck;
  }

  /**
   * Create an external salary payment to Netvisor.
   * @example await payrollExternalSalaryPayment(payment);
   */
  async payrollExternalSalaryPayment(payment: PayrollExternalSalaryPayment): Promise<void> {
    // Netvisor wants sum in string format '1234,56'
    payment.externalPaymentSum = String(payment.externalPaymentSum).replace('.', ',');
    await this._client.post('payrollexternalsalarypayment.nv', buildXml({ root: { payrollexternalsalarypayment: payment } }));
  }

  /**
   * Create a new job period for employee in Netvisor.
   * @example await addJobPeriod(jobPeriod, { employeeIdentifier: 123 });
   * @returns Added job period's netvisor key
   */
  async addJobPeriod(jobPeriod: AddJobPeriod, params: AddJobPeriodParameters): Promise<string> {
    const response = await this._client.post('addjobperiod.nv', buildXml({ root: { employmentperiods: jobPeriod } }), params);
    return parseXml(response).replies.inserteddataidentifier;
  }

  /**
   * Edit existing job period in Netvisor.
   * @example await editJobPeriod(jobPeriod, { netvisorKey: 123 });
   */
  async editJobPeriod(jobPeriod: EditJobPeriod, params: EditJobPeriodParameters): Promise<void> {
    await this._client.post('editjobperiod.nv', buildXml({ root: { employmentperiods: jobPeriod } }), params);
  }

  /**
   * Delete existing job period in Netvisor.
   * @example await deleteJobPeriod({ netvisorKey: 123 });
   */
  async deleteJobPeriod(params: DeleteJobPeriodParameters): Promise<void> {
    await this._client.post('deletejobperiod.nv', undefined, params);
  }

  /**
   * Get payroll parties from Netvisor
   * @example await getPayrollParties();
   */
  async getPayrollParties(): Promise<GetPayrollPartiesItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getpayrollparties.nv');
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const payrollParties: GetPayrollPartiesItem[] = [];
    // Add items to return array
    if (xmlObject.payrollparties?.party) {
      forceArray(xmlObject.payrollparties.party).forEach((xmlParty: any) => {
        // Create the payroll party item object
        payrollParties.push({
          netvisorKey: parseInt(xmlParty.netvisorkey),
          name: xmlParty.name,
          partyInternalType: xmlParty.partyinternaltype,
          useOnlyInReporting: xmlParty.useonlyinreporting === '1' ? true : false
        });
      });
    }
    return payrollParties;
  }

  /**
   * Attach existing employee to one or more settlement points in Netvisor.
   * @example await attachEmployeeToSettlementPoint(settlementPoints, { identifierType: 'netvisorkey', identifier: 123 });
   */
  async attachEmployeeToSettlementPoint(
    settlementPoints: AttachEmployeeToSettlementPoint,
    params: AttachEmployeeToSettlementPointParameters
  ): Promise<void> {
    await this._client.post(
      'attachemployeetosettlementpoint.nv',
      buildXml({ root: { attachemployeetosettlementpoint: settlementPoints } }),
      params
    );
  }
}
