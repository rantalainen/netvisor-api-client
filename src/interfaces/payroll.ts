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
 * employee.nv
 */

export interface EmployeeParameters {
  /** If editing employee, employeeIdentifier or foreignEmployeeIdentification.identifier must be given */
  method: 'add' | 'edit';
}

export interface Employee {
  employeeBaseInformation: {
    foreignEmployeeIdentification?: {
      identifier: {
        val: string;
        attr: { type: 'taxidentificationnumber' | 'foreignpersonalidentifier' | 'other' };
      };
      issuingCountry: {
        val: string;
        attr: { type: 'ISO-3166' };
      };
      gender: 'male' | 'female';
      dateOfBirth: {
        val: string;
        attr: { format: 'ansi' };
      };
    };
    employeeIdentifier?: string;
    companyIdentifier?: string;
    companyName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
  };
  employeePayrollInformation: {
    streetAddress: string;
    postNumber: string;
    city: string;
    municipality?: string;
    country: string;
    nationality: string;
    language: string;
    employeeNumber?: number;
    profession?: string;
    jobBeginDate?: {
      val: string;
      attr: { format: 'ansi' };
    };
    payrollRuleGroupName: string;
    bankAccountNumber?: string;
    bankIdentificationCode?: string;
    accountingAccountNumber?: number;
    hierarchy?: {
      val: string;
      attr: { type: 'netvisor' | 'customer' };
    };
    dimension?: {
      dimensionName: string;
      dimensionItem:
        | {
            val: string;
            attr: { fatherid: number };
          }
        | string;
    }[];
    payslipDeliveryMethod?: {
      /** 1 = paikallinen tulostus, 2 = tulostuspalvelu, 3 = verkkopalkka */
      val: 1 | 2 | 3;
      attr: { type: 'netvisor' };
    };
    isJointOwner?: 1 | 0;
    isAthlete?: 1 | 0;
    isPerformingArtist?: 1 | 0;
    /** 1 = Tyel, 2 = MYEL, 3 = YEL, 4 = Ei eläkevakuutettu */
    employeeInsuranceType?: 1 | 2 | 3 | 4;
    isPersonWorkingOnARoadFerryOnAlandIslands?: 1 | 0;
    /** If set to true, employeeInsuranceType must be 4 */
    isEntrepreneurWithOptionalYelOrMyel?: 1 | 0;
    noSocialSecurityPayment?: 1 | 0;
    activity?: 1 | 0;
    foreclosure?: 1 | 0;
    foreclosureMaintenancePersons?: number;
    taxNumber?: string;
    placeOfBusiness?: string;
  };
  employmentPeriods?: {
    employmentPeriod: {
      companyStartDate?: {
        val: string;
        attr: { format: 'ansi' };
      };
      startDate: {
        val: string;
        attr: { format: 'ansi' };
      };
      probationEndDate?: {
        val: string;
        attr: { format: 'ansi' };
      };
      employmentMode?: {
        /** 1 = työsuhteinen, 2 = vuokratyöntekijä, 3 = ammatinharjoittaja tai muu vastaava, 4 = harjoittelija, 5 = talkootyö */
        val: 1 | 2 | 3 | 4 | 5;
        attr: { type: 'netvisor' };
      };
      profession: string;
      comment?: string;
      endDate?: {
        val: string;
        attr: { format: 'ansi' };
      };
      endReason?: {
        /** 2 = Työntekijän vanhuuseläke, 4 = Työntekijän oma pyyntö, 5 = Työntekijästä johtuva syy, 6 = Työsuhteen määräaikaisuus,
         * 11 = Yrityksen tuotannolliset ja taloudelliset syyt, 12 = Työsuhteen päättyminen yhteisestä sopimuksesta, 13 = Muu syy */
        val: 2 | 4 | 5 | 6 | 11 | 12 | 13;
        attr: { type: 'netvisor' };
      };
      occupationClassification?: {
        val: string;
        attr: { type: 'isco' };
      };
      employmentContract?: {
        /** 1 = Toistaiseksi voimassa oleva, 2 = Määräaikainen */
        val: 1 | 2;
        attr: { type: 'netvisor' };
      };
      employmentForm?: {
        /** 1 = Kokoaikainen, 2 = Osa-aikainen, 3 = tietoa ei saatavilla */
        val: 1 | 2 | 3;
        attr: { type: 'netvisor' };
      };
      /** Decimal between 0 and 100. If given, employmentForm must be 2 */
      partTimePercent?: number;
      /** Decimal between 0 and 168 */
      regularWorkingHours?: number;
      /** 0 = Muu peruste, 1 = Työsuhde tai virkasuhde */
      groundsForEmployment?: 0 | 1;
      kevaProfessionalClassCode?: string;
      kevaEmploymentRegistration?: {
        val: string;
        attr: { type: 'keva'; pensionProviderCode?: number };
      };
      isPaymentTypeMonthlyWage?: 1 | 0;
      isPaymentTypeHourlyWage?: 1 | 0;
      isPaymentTypePieceWage?: 1 | 0;
      collectiveAgreement?: {
        val: string;
        attr: { type: 'cbacode' };
      };
      stateEmploymentFund?: 1 | 0;
      carBenefitYear?: number;
      isAbroadCarBenefit?: 1 | 0;
      /** Integer between 0 and 100 */
      carEmissionsValue?: number;
    }[];
  };
  employeeSettings?: {
    payrollService?: 'enabled' | 'disabled';
    resourceManagement?: 'enabled' | 'disabled';
  };
  employeeSettlementPoints?: {
    employeeWorkPensionInsurance?: {
      type:
        | 'nohandling'
        | 'automatichandling'
        | 'under17yearsold'
        | '17to52yearsold'
        | '53to62yearsold'
        | '63to67yearsold'
        | 'over68yearsold';
      name: string;
    }[];
    employeeUnemploymentInsurance?: {
      type: 'nohandling' | 'automatichandling' | 'under17yearsold' | '17to64yearsold' | 'over65yearsold' | 'partowner';
      name: string;
    }[];
    employeeAccidentInsurance?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
    employeeGroupLifeInsurance?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
    employeeOtherInsurance?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
    employeeUnionMembershipFee?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
    employeeForeclosure?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
  };
  employeeEducationalInformation?: {
    degree?: {
      name: string;
      school: string;
      graduationYear: number;
      primaryDegree: 1 | 0;
    }[];
  };
  employeeAdditionalInformation?: {
    additionalInformationField?: {
      name: string;
      value: string;
    }[];
  };
}

/*
 * RESOURCE
 * patchemployee.nv
 */

export interface PatchEmployeeParameters {
  identifierType: 'netvisorkey' | 'number' | 'personalidentificationnumber';
  identifier: string;
}

export interface PatchEmployee {
  employeeBaseInformation?: {
    companyName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
  };
  employeePayrollInformation?: {
    streetAddress?: string;
    postNumber?: string;
    city?: string;
    municipality?: string;
    country?: string;
    nationality?: string;
    language?: string;
    employeeNumber?: number;
    payrollRuleGroupName?: string;
    bankAccountNumber?: string;
    bankIdentificationCode?: string;
    accountingAccountNumber?: number;
    hierarchy?: {
      value: string;
      attr: { type: 'netvisor' | 'customer' };
    };
    payslipDeliveryMethod?: {
      /** 1 = paikallinen tulostus, 2 = tulostuspalvelu, 3 = verkkopalkka */
      value: 1 | 2 | 3;
      attr: { type: 'netvisor' };
    };
    isJointOwner?: 1 | 0;
    isAthlete?: 1 | 0;
    isPerformingArtist?: 1 | 0;
    /** 1 = Tyel, 2 = MYEL, 3 = YEL, 4 = Ei eläkevakuutettu */
    employeeInsuranceType?: 1 | 2 | 3 | 4;
    isPersonWorkingOnARoadFerryOnAlandIslands?: 1 | 0;
    /** If set to true, employeeInsuranceType must be 4 */
    isEntrepreneurWithOptionalYelOrMyel?: 1 | 0;
    isPersonReceivingEppoInsuranceSalary?: 1 | 0;
    noSocialSecurityPayment?: 1 | 0;
    receivesSalaryFromDiplomaticEmbassy?: 1 | 0;
    activity?: 1 | 0;
    foreclosure?: 1 | 0;
    foreclosureMaintenancePersons?: number;
    taxNumber?: string;
    placeOfBusiness?: string;
  };
  employeeSettings?: {
    payrollService?: 'enabled' | 'disabled';
    resourceManagement?: 'enabled' | 'disabled';
  };
}

/*
 * RESOURCE
 * getemployeesalaryparameters.nv
 */

export interface GetEmployeeSalaryParametersParams {
  identifierType: 'netvisorkey' | 'number' | 'pin';
  identifier: string;
}

export interface GetEmployeeSalaryParametersItem {
  ratioNumber: number;
  value: number;
}

/*
 * RESOURCE
 * employeesalaryparameters.nv
 */

export interface EmployeeSalaryParameters {
  employeeIdentification: {
    val: string;
    attr: { type: 'number' | 'pin' | 'netvisorkey' };
  };
  salaryParameters: {
    salaryParameter: {
      ratioNumber: number;
      value?: number;
    }[];
  };
}

/*
 * RESOURCE
 * payrollratiolist.nv
 */

export interface PayrollRatioListParameters {
  /** tripexpensecustomlines = matkalasku, kulurivit; taxingrules = verokortti; collectorratiolines = palkkajaksokohtainen kirjaus;
   * userparameters = palkansaajan perustiedot; companyparameters = yrityksen perustiedot; userformula = käyttäjän kaava;
   * tabledata = taulukkodata; foreclosure = ulosotto; lowsalarysupport = matalapalkkatuki */
  source:
    | 'tripexpensecustomlines'
    | 'taxingrules'
    | 'collectorratiolines'
    | 'userparameters'
    | 'companyparameters'
    | 'userformula'
    | 'tabledata'
    | 'foreclosure'
    | 'lowsalarysupport';
}

export interface PayrollRatioListItem {
  names: {
    name: {
      value: string;
      attr: { 'iso639-1code': 'fi' | 'se' | 'en' };
    }[];
  };
  identifier: {
    value: number;
    attr: { type: 'Netvisor' };
  };
  source: {
    value: string;
    attr: { netvisorkey: number };
  };
  ratioNumber?: number;
  defaultDebitAccountNumber?: number;
  defaultCreditAccountNumber?: number;
}

/*
 * RESOURCE
 * payrollpaycheckbatch.nv
 */

export interface PayrollPaycheckBatch {
  employeeIdentifier: {
    value: string;
    attr: { type: 'number' | 'finnishpersonalidentifier' | 'netvisorkey' };
  };
  ruleGroupPeriodStart: {
    value: string;
    attr: { format: 'ansi' };
  };
  ruleGroupPeriodEnd: {
    value: string;
    attr: { format: 'ansi' };
  };
  freeTextBeforeLines?: string;
  freeTextAfterLines?: string;
  dueDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  valueDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  payrollPaycheckBatchLine: PayrollPaycheckBatchLine[];
}

export interface PayrollPaycheckBatchLine {
  payrollRatioIdentifier: {
    value: string;
    attr: { type: 'rationumber' };
  };
  units: number;
  unitAmount: number;
  lineSum: number;
  lineDescription?: string;
  earningPeriodStartDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  earningPeriodEndDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  dimension?: {
    dimensionName: string;
    dimensionItem: string;
  }[];
}

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
 * payrolladvance.nv
 */

export interface PayrollAdvance {
  description?: string;
  employeeIdentifier: {
    value: string;
    attr: { type: 'employeenumber' | 'finnishpersonalidentifier' | 'netvisorkey' };
  };
  paymentDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  advanceSum: {
    value: number;
    attr: { paymentStatus?: 'ispaid' | 'notpaid' };
  };
  paymentType: 'payroll' | 'tripexpence';
}

/*
 * RESOURCE
 * payrollexternalsalarypayment.nv
 */

export interface PayrollExternalSalaryPayment {
  description?: string;
  /** Date when salary is in employee's bank account. Use either paymentDate or dueDate. */
  paymentDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  /** Date when salary leaves from company's bank account. Use either paymentDate or dueDate. */
  dueDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  externalPaymentSum: string | number;
  iban: string;
  bic: string;
  hetu?: string;
  realName: string;
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

/*
 * RESOURCE
 * addjobperiod.nv
 */

export interface AddJobPeriodParameters {
  employeeIdentifier: number;
}

export interface AddJobPeriod {
  employmentPeriod: {
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
      value: 1 | 2 | 3 | 4 | 5;
      attr: { type: 'netvisor' };
    };
    profession: string;
    comment?: string;
    endDate?: {
      value: string;
      attr: { format: 'ansi' };
    };
    endReason?: {
      /** 2 = Työntekijän vanhuuseläke, 4 = Työntekijän oma pyyntö, 5 = Työntekijästä johtuva syy, 6 = Työsuhteen määräaikaisuus,
       * 11 = Yrityksen tuotannolliset ja taloudelliset syyt, 12 = Työsuhteen päättyminen yhteisestä sopimuksesta, 13 = Muu syy */
      value: 2 | 4 | 5 | 6 | 11 | 12 | 13;
      attr: { type: 'netvisor' };
    };
    occupationClassification?: {
      value: string;
      attr: { type: 'isco' };
    };
    employmentContract?: {
      /** 1 = Toistaiseksi voimassa oleva, 2 = Määräaikainen */
      value: 1 | 2;
      attr: { type: 'netvisor' };
    };
    employmentForm?: {
      /** 1 = Kokoaikainen, 2 = Osa-aikainen, 3 = tietoa ei saatavilla */
      value: 1 | 2 | 3;
      attr: { type: 'netvisor' };
    };
    partTimePercent?: number;
    regularWorkingHours?: number;
    groundsForEmployment?: 0 | 1;
    kevaProfessionalClassCode?: {
      value: string;
      attr: { type: 'keva'; pensionprovidercode?: number };
    };
    isPaymentTypeMonthlyWage?: 1 | 0;
    isPaymentTypeHourlyWage?: 1 | 0;
    isPaymentTypePieceWage?: 1 | 0;
    collectiveAgreement?: {
      value: string;
      attr: { type: 'cbacode' };
    };
    stateEmploymentFund?: 1 | 0;
    carBenefitYear?: number;
    isAbroadCarBenefit?: 1 | 0;
  }[];
}

/*
 * RESOURCE
 * editjobperiod.nv
 */

export interface EditJobPeriodParameters {
  netvisorKey: number;
}

export interface EditJobPeriod {
  employmentPeriod: {
    companyStartDate?: {
      value: string;
      attr: { format: 'ansi' };
    };
    startDate?: {
      value: string;
      attr: { format: 'ansi' };
    };
    probationEndDate?: {
      value: string;
      attr: { format: 'ansi' };
    };
    employmentMode?: {
      /** 1 = työsuhteinen, 2 = vuokratyöntekijä, 3 = ammatinharjoittaja tai muu vastaava, 4 = harjoittelija, 5 = talkootyö */
      value: 1 | 2 | 3 | 4 | 5;
      attr: { type: 'netvisor' };
    };
    profession?: string;
    comment?: string;
    endDate?: {
      value: string;
      attr: { format: 'ansi' };
    };
    endReason?: {
      /** 2 = Työntekijän vanhuuseläke, 4 = Työntekijän oma pyyntö, 5 = Työntekijästä johtuva syy, 6 = Työsuhteen määräaikaisuus,
       * 11 = Yrityksen tuotannolliset ja taloudelliset syyt, 12 = Työsuhteen päättyminen yhteisestä sopimuksesta, 13 = Muu syy */
      value: 2 | 4 | 5 | 6 | 11 | 12 | 13;
      attr: { type: 'netvisor' };
    };
    occupationClassification?: {
      value: string;
      attr: { type: 'isco' };
    };
    employmentContract?: {
      /** 1 = Toistaiseksi voimassa oleva, 2 = Määräaikainen */
      value: 1 | 2;
      attr: { type: 'netvisor' };
    };
    employmentForm?: {
      /** 1 = Kokoaikainen, 2 = Osa-aikainen, 3 = tietoa ei saatavilla */
      value: 1 | 2 | 3;
      attr: { type: 'netvisor' };
    };
    partTimePercent?: number;
    regularWorkingHours?: number;
    groundsForEmployment?: 0 | 1;
    kevaProfessionalClassCode?: {
      value: string;
      attr: { type: 'keva'; pensionprovidercode?: number };
    };
    isPaymentTypeMonthlyWage?: 1 | 0;
    isPaymentTypeHourlyWage?: 1 | 0;
    isPaymentTypePieceWage?: 1 | 0;
    collectiveAgreement?: {
      value: string;
      attr: { type: 'cbacode' };
    };
    stateEmploymentFund?: 1 | 0;
    carBenefitYear?: number;
    isAbroadCarBenefit?: 1 | 0;
  };
}

/*
 * RESOURCE
 * deletejobperiod.nv
 */

export interface DeleteJobPeriodParameters {
  netvisorKey: number;
}

/*
 * RESOURCE
 * getpayrollparties.nv
 */

export interface GetPayrollPartiesItem {
  netvisorKey: number;
  name: string;
  partyInternalType: string;
  useOnlyInReporting: boolean;
}

/*
 * RESOURCE
 * attachemployeetosettlementpoint.nv
 */

export interface AttachEmployeeToSettlementPointParameters {
  identifierType: 'netvisorkey' | 'number' | 'personalidentificationnumber';
  identifier: string;
}

export interface AttachEmployeeToSettlementPoint {
  /** 1 = TyEL, 2 = MYEL, 3 = YEL, 4 = Ei vakuutettu */
  employeeInsuranceType?: number;
  employeeSettlementPoints: {
    employeeWorkPensionInsurance?: {
      type:
        | 'nohandling'
        | 'automatichandling'
        | 'under17yearsold'
        | '17to52yearsold'
        | '53to62yearsold'
        | '63to67yearsold'
        | 'over68yearsold';
      /** Name or netvisor key must be given */
      name?: string;
      /** Name or netvisor key must be given */
      netvisorKey?: number;
      reportToIncomeRegister?: number;
    };
    employeeUnemploymentInsurance?: {
      type: 'nohandling' | 'automatichandling' | 'under17yearsold' | '17to64yearsold' | 'over65yearsold' | 'partowner';
      /** Name or netvisor key must be given */
      name?: string;
      /** Name or netvisor key must be given */
      netvisorKey?: number;
    }[];
    employeeAccidentInsurance?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      /** Name or netvisor key must be given */
      name?: string;
      /** Name or netvisor key must be given */
      netvisorKey?: number;
      reportToIncomeRegister?: number;
    }[];
    employeeGroupLifeInsurance?: GenericSettlementPoint[];
    employeeOtherInsurance?: GenericSettlementPoint[];
    employeeUnionMembershipFee?: GenericSettlementPoint[];
    employeeForeclosure?: GenericSettlementPoint[];
  };
}

export interface GenericSettlementPoint {
  type: 'nohandling' | 'attachedtosettlementpoint';
  /** Name or netvisor key must be given */
  name?: string;
  /** Name or netvisor key must be given */
  netvisorKey?: number;
}
