export type AccountingProfile =
  | 'AllRights'
  | 'BrowsingRights'
  | 'NoRights'
  | 'PurchaseledgerUser'
  | 'SalesledgerUser'
  | 'PurchaseAndSalesLedgerUser'
  | 'CompanyUser';
export type PayrollProfile = 'AllRights' | 'BrowsingRights' | 'NoRights' | 'EmployeeRights' | 'AcceptorRights' | 'CompanyManagementRights';

/*
 * RESOURCE
 * getuseraccessrightssummary.nv
 */

export interface UserAccessRightsSummaryParameters {
  company: number;
  // Use empty string for all users, a single number for one user, or an array of numbers for multiple users
  users: '' | number | number[];
}

export interface UserAccessRightsSummary {
  company: {
    attr: {
      netvisorKey: number;
      name: string;
    };
    users: {
      user: {
        attr: { netvisorKey: number };
        firstName: string;
        lastName: string;
        roles: {
          isCompanyAdmin: boolean;
          isAccountOfficeSuperUser: boolean;
          isUserAdmin: boolean;
          isAuditor: boolean;
          isAccountant: boolean;
          isPayrollAccountant: boolean;
          isPayrollPersonnelManager: boolean;
          isPayrollEmployeeController: boolean;
        };
        profiles: {
          accountingProfile: AccountingProfile;
          payrollProfile: PayrollProfile;
        };
        validFrom?: string;
        validTo?: string;
      }[];
    };
  };
}

/*
 * RESOURCE
 * changeuseraccessrightsvalidity.nv
 */

export interface UserAccessRightValidity {
  user: {
    value: number;
    attr: { type: 'netvisorkey' };
  };
  company: {
    value: number;
    attr: { type: 'netvisorkey' };
  };
  useForAllCompanies: 1 | 0;
  /** Format YYYY-MM-DD */
  validFrom: string;
  /** Format YYYY-MM-DD */
  validTo: string;
}

/*
 * RESOURCE
 * edituseraccessrights.nv
 */

export interface UserAccessRights {
  user: {
    value: number;
    attr: { type: 'netvisorkey' };
  };
  company: {
    value: number;
    attr: { type: 'netvisorkey' };
  };
  isUserAdmin?: 1 | 0;
  isAccountant?: 1 | 0;
  isAuditor?: 1 | 0;
  isPayrollAccountant?: 1 | 0;
  isPayrollPersonnelManager?: 1 | 0;
  isPayrollEmployeeController?: 1 | 0;
  accountingProfile?: AccountingProfile;
  payrollProfile?: PayrollProfile;
}

/*
 * RESOURCE
 * deleteuseraccessright.nv
 */

export interface DeleteUserAccessRight {
  user: {
    value: number;
    attr: { type: 'netvisorkey' };
  };
  company: {
    value: number;
    attr: { type: 'netvisorkey' };
  };
}
