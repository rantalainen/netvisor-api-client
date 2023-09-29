/*
 * RESOURCE
 * payrollperiodcollector.nv
 */

export interface PayrollPeriodCollector {
  date: {
    value: string;
    attr: { format: 'ansi' };
  };
  employeeIdentifier: {
    value: string;
    attr: { type: 'number' | 'personalidentificationnumber' };
  };
  payrollRatioLine: {
    amount: number;
    payrollRatio: {
      value: number;
      attr: { type: 'number' };
    };
    dimension?: {
      dimensionName: string;
      dimensionItem:
        | string
        | {
            value: string;
            attr: { fatherId: number };
          };
    }[];
  }[];
}

/*
 * RESOURCE
 * getemployees.nv
 */

export interface GetEmployeesParameters {
  includeEndedEmployments?: 1 | 0;
}

export interface GetEmployeesItem {
  employeeNumber?: number;
  netvisorKey: number;
  personalId: {
    value: string;
    attr: { type: string };
  };
  firstName: string;
  lastName: string;
  realName: string;
  employmentStatus: boolean;
  payrollService: boolean;
  resourceManagement: boolean;
}

/*
 * RESOURCE
 * getemployee.nv
 */

export interface GetEmployeeParameters {
  /** If given, do not give employeeNumber */
  netvisorKey?: number;
  /** If given, do not give netvisorKey */
  employeeNumber?: number;
  employmentPeriods?: 1 | 0;
  employeePayrollInformation?: 1 | 0;
  educationalInformation?: 1 | 0;
  additionalInformationFields?: 1 | 0;
  employeeSettlementPoints?: 1 | 0;
}

export interface GetEmployee {
  employeeBaseInformation: {
    netvisorKey: number;
    employeeNumber?: number;
    employeeIdentifier: {
      value: string;
      attr: { type: string };
    };
    foreignIdentifierType?: string;
    issuingCountry?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    firstName: string;
    lastName: string;
    fullName: string;
    payrollService: boolean;
    resourceManagement: boolean;
    nationality: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    language: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    municipality?: string;
    gender: string;
    dateOfBirth: string;
    streetAddress: string;
    postNumber: string;
    city: string;
    country: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    phoneNumber?: string;
    email?: string;
    bankAccountNumber?: string;
    bankIdentificationCode?: string;
    activity: boolean;
  };
  employmentPeriods?: GetEmployeeEmploymentPeriod[];
  employeePayrollInformation?: GetEmployeePayrollInformation;
  employeeEducationalInformation?: {
    degree: GetEmployeeEducationalInformationDegree[];
  };
  employeeAdditionalInformationFields?: {
    additionalInformationField: GetEmployeeAdditionalInformationField[];
  };
  employeeSettlementPoints?: {
    employeeUnemploymentInsurance?: GetEmployeeSettlementPoint[];
    employeeAccidentInsurance?: GetEmployeeSettlementPoint[];
    employeeGroupLifeInsurance?: GetEmployeeSettlementPoint[];
    employeeUnionMembershipFee?: GetEmployeeSettlementPoint[];
    employeeOtherInsurance?: GetEmployeeSettlementPoint[];
    employeeWorkPensionInsurance?: GetEmployeeSettlementPoint[];
    employeeForeclosure?: GetEmployeeSettlementPoint[];
  };
}

export interface GetEmployeeEmploymentPeriod {
  netvisorKey: number;
  companyStartDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  startDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  probationEndDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  employmentMode?: {
    /** 1 = työsuhteinen, 2 = vuokratyöntekijä, 3 = ammatinharjoittaja tai muu vastaava, 4 = harjoittelija, 5 = talkootyö */
    value: number;
    attr: { type: 'netvisor' };
  };
  profession: string;
  comment?: string;
  endDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  endReason?: {
    /** 2 = Työntekijän vanhuuseläke, 4 = Työntekijän oma pyyntö, 5 = Työntekijästä johtuva syy, 6 = Työsuhteen määräaikaisuus, 11 = Yrityksen tuotannolliset ja taloudelliset syyt, 12 = Työsuhteen päättyminen yhteisestä sopimuksesta, 13 = Muu syy */
    value: number;
    attr: { type: 'netvisor' };
  };
  occupationClassification?: {
    /** TK10 code */
    value: string;
    attr: { type: 'isco' };
  };
  employmentContract?: {
    /** 1 = Toistaiseksi voimassa oleva, 2 = Määräaikainen */
    value: number;
    attr: { type: 'netvisor' };
  };
  employmentForm?: {
    /** 1 = Kokoaikainen, 2 = Osa-aikainen */
    value: number;
    attr: { type: 'netvisor' };
  };
  partTimePercent?: number;
  regularWorkingHours?: number;
  /** 0 = Muu peruste, 1 = Työsuhde tai virkasuhde */
  groundsForEmployment: number;
  kevaProfessionalClassCode?: string;
  kevaEmploymentRegistration?: {
    value: string;
    attr: { type: 'keva'; pensionprovidercode: string };
  };
  isPaymentTypeMonthlyWage: boolean;
  isPaymentTypeHourlyWage: boolean;
  isPaymentTypePieceWage: boolean;
  collectiveAgreement?: {
    value: number;
    attr: { pensionprovidercode: 'cbacode' };
  };
  stateEmploymentFund: boolean;
  carBenefitYear?: number;
  isAbroadCarBenefit: boolean;
  carEmissionValue?: number;
}

export interface GetEmployeePayrollInformation {
  payrollRuleGroup?: {
    netvisorKey: number;
    name: string;
  };
  taxNumber?: number;
  foreclosure: boolean;
  foreclosureMaintenancePersons?: number;
  noSocialSecurityPayment: boolean;
  accountingAccount: {
    netvisorKey: number;
    name: string;
    number: number;
  };
  hierarchy: {
    netvisorKey: number;
    name: string;
  };
  placeOfBusiness?: string;
  defaultDimensions?: {
    defaultDimension: {
      dimensionName: string;
      dimensionItem: string;
    }[];
  };
  payslipDeliveryMethod: {
    /** 1 = paikallinen tulostus, 2 = tulostuspalvelu, 3 = verkkopalkka */
    value: number;
    attr: { type: 'netvisor' };
  };
  isJointOwner: boolean;
  isAthlete: boolean;
  isPerformingArtist: boolean;
  /** 1 = Tyel, 2 = MYEL, 3 = YEL, 4 = Ei eläkevakuutettu */
  employeeInsuranceType?: number;
  isPersonWorkingOnARoadFerryOnALandIslands: boolean;
  isEntrepreneurWithOptionalYelOrMyel: boolean;
}

export interface GetEmployeeEducationalInformationDegree {
  name: string;
  school?: string;
  graduationYear?: number;
  isPrimaryDegree: boolean;
}

export interface GetEmployeeAdditionalInformationField {
  netvisorKey?: number;
  name: string;
  value?: {
    value: string;
    attr: { type: string };
  };
  group: {
    /** 1 = Perustiedot, 2 = Yhteystiedot, 3 = Koulutustiedot */
    value: number;
    attr: { type: 'netvisor' };
  };
}

export interface GetEmployeeSettlementPoint {
  netvisorKey: number;
  type: string;
  name: string;
}

/*
 * RESOURCE
 * getpayrollpaycheckbatchlist.nv
 */

export interface GetPayrollPaycheckBatchListParameters {
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate?: string;
}

export interface GetPayrollPaycheckBatchListItem {
  netvisorKey: number;
  paymentDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  payrollRuleGroupPeriod: {
    netvisorKey: number;
    startDate: {
      value: string;
      attr: { format: 'ansi' };
    };
    endDate: {
      value: string;
      attr: { format: 'ansi' };
    };
  };
  payrollRuleGroup: {
    netvisorKey: number;
    name: string;
  };
  employee: {
    name: string;
    employeeNumber?: number;
    netvisorKey: number;
  };
  /** 1 = Avoin, 2 = Kuitattu/Hyväksytty, 3 = Maksettu  */
  status: number;
  statusDescription: string;
}

/*
 * RESOURCE
 * getpayrollpaycheckbatch.nv
 */

export interface GetPayrollPaycheckBatchParameters {
  netvisorKey: number;
}

export interface GetPayrollPaycheckBatch {
  paymentDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  payrollRuleGroupPeriod: {
    netvisorKey: number;
    startDate: {
      value: string;
      attr: { format: 'ansi' };
    };
    endDate: {
      value: string;
      attr: { format: 'ansi' };
    };
  };
  payrollRuleGroup: {
    netvisorKey: number;
    name: string;
  };
  employee: {
    netvisorKey: number;
    name: string;
    employeeNumber?: number;
  };
  /** 1 = Avoin, 2 = Kuitattu/Hyväksytty, 3 = Maksettu  */
  status: number;
  voucher?: {
    netvisorKey: number;
    class: string;
    number: number;
    date: {
      value: string;
      attr: { format: 'ansi' };
    };
  };
  allocationCurves?: {
    allocationCurve: GetPayrollPaycheckBatchAllocationCurve[];
  };
  freeTextBeforeLines?: string;
  freeTextAfterLines?: string;
  holidayRecords: {
    availableHolidays: number;
    newAccrualOfHolidays: number;
  };
  payrollPaycheckBatchLines: {
    payrollPaycheckBatchLine: GetPayrollPaycheckBatchPayrollLine[];
  };
}

export interface GetPayrollPaycheckBatchAllocationCurve {
  percent: number;
  dimensions: {
    dimension: {
      dimensionName: {
        value: string;
        attr: { netvisorKey: number };
      };
      dimensionItem: {
        value: string;
        attr: { netvisorKey: number };
      };
    }[];
  };
}

export interface GetPayrollPaycheckBatchPayrollLine {
  payrollRatio: {
    netvisorKey: number;
    number?: number;
    name: string;
    isVisible: boolean;
    costObjectSource: string;
  };
  units?: number;
  unitAmount?: number;
  lineSum: number;
  earningPeriods?: {
    earningPeriod: {
      startDate: {
        value: string;
        attr: { format: 'ansi' };
      };
      endDate: {
        value: string;
        attr: { format: 'ansi' };
      };
    }[];
  };
  incomeType?: {
    netvisorKey: number;
    number: number;
    name: string;
  };
  accountingData: {
    debetAccountNetvisorKey?: number;
    debetAccountNumber?: number;
    debetAccountName?: string;
    kreditAccountNetvisorKey?: number;
    kreditAccountNumber?: number;
    kreditAccountName?: string;
  };
  dimensions?: {
    dimension: {
      percent: number;
      dimensionName: {
        value: string;
        attr: { netvisorKey: number };
      };
      dimensionItem: {
        value: string;
        attr: { netvisorKey: number };
      };
    }[];
  };
  lineDescription: string;
}
