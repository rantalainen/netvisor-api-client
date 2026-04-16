import { NetvisorApiClient } from '..';
import { NetvisorMethod, forceArray, parseXml, buildXml } from './_method';
import {
  DeleteUserAccessRight,
  UserAccessRights,
  UserAccessRightsSummary,
  UserAccessRightsSummaryParameters,
  UserAccessRightValidity
} from '../interfaces/useraccess';
import { reorderProperties } from '../utils/reorder-properties';

export class NetvisorUserAccessMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get user access rights summary for a company and optionally specific users.
   * If users parameter is not given, it will return access rights summary for all users in the company.
   * @param params - Parameters for company and optional users
   * @returns User access rights summary for the specified company and users
   */
  async getUserAccessRightsSummary(params: UserAccessRightsSummaryParameters): Promise<UserAccessRightsSummary> {
    const queryParams = {
      company: params.company,
      users: Array.isArray(params.users) ? params.users.join(',') : params.users
    };
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getuseraccessrightssummary.nv', queryParams);
    // Parse the xml to js object
    const xmlObject = parseXml(responseXml);
    // Create the summary object with empty users array
    const userAccessSummary: UserAccessRightsSummary = {
      company: {
        attr: {
          netvisorKey: Number(xmlObject.company.attr.netvisorkey),
          name: xmlObject.company.attr.name
        },
        users: {
          user: []
        }
      }
    };
    // Add users to the summary object, if there are any
    if (xmlObject.company.users.user) {
      const users = forceArray(xmlObject.company.users.user);
      for (const user of users) {
        userAccessSummary.company.users.user.push({
          attr: {
            netvisorKey: Number(user.attr.netvisorkey)
          },
          firstName: user.firstname,
          lastName: user.lastname,
          roles: {
            isCompanyAdmin: user.roles.iscompanyadmin === 'true',
            isAccountOfficeSuperUser: user.roles.isaccountofficesuperuser === 'true',
            isUserAdmin: user.roles.isuseradmin === 'true',
            isAuditor: user.roles.isauditor === 'true',
            isAccountant: user.roles.isaccountant === 'true',
            isPayrollAccountant: user.roles.ispayrollaccountant === 'true',
            isPayrollPersonnelManager: user.roles.ispayrollpersonnelmanager === 'true',
            isPayrollEmployeeController: user.roles.ispayrollemployeecontroller === 'true'
          },
          profiles: {
            accountingProfile: user.profiles.accountingprofile,
            payrollProfile: user.profiles.payrollprofile
          },
          validFrom: user.validfrom || undefined,
          validTo: user.validto || undefined
        });
      }
    }
    return userAccessSummary;
  }

  /**
   * Change the validity period of a user's access rights for a company.
   * @param validityData - Data for changing the validity of user access rights
   */
  async changeUserAccessRightValidity(validityData: UserAccessRightValidity): Promise<void> {
    await this._client.post(
      'changeuseraccessrightsvalidity.nv',
      buildXml({ root: { changeUserAccessRightsValidity: reorderProperties(validityData, 'UserAccessRightValidity') } })
    );
  }

  /**
   * Edit a user's access rights for a company.
   * @param editData - Data for editing user access rights
   */
  async editUserAccessRights(editData: UserAccessRights): Promise<void> {
    await this._client.post(
      'edituseraccessrights.nv',
      buildXml({ root: { editUserAccessRights: reorderProperties(editData, 'UserAccessRights') } })
    );
  }

  /**
   * Delete a user's access rights for a company.
   * @param deleteData - Data for deleting user access rights. Only user and company netvisor keys are required
   */
  async deleteUserAccessRight(deleteData: DeleteUserAccessRight): Promise<void> {
    await this._client.post(
      'deleteuseraccessright.nv',
      buildXml({ root: { deleteUserAccessRight: reorderProperties(deleteData, 'DeleteUserAccessRight') } })
    );
  }
}
