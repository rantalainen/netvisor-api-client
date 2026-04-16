import { NetvisorApiClient } from '..';
import { NetvisorMethod, forceArray, parseXml, buildXml } from './_method';
import {
  CancelUserInvitation,
  GetUserInvitation,
  GetUserInvitationParameters,
  SendUserInvitation,
  VerifyUserInvitation
} from '../interfaces/invitations';
import { reorderProperties } from '../utils/reorder-properties';

export class NetvisorInvitationsMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get user invitations for the company. If no parameters are given, it will use default values
   * @param params - Optional parameters for pagination and filtering. Default filter for invitationStatus is 'Authenticated, WaitingForAuth'
   * @returns A list of user invitations and pagination metadata
   */
  async getUserInvitations(params?: GetUserInvitationParameters): Promise<GetUserInvitation> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('getuserinvitations.nv', params);
    // Parse the xml to js object
    const xmlObject = parseXml(responseXml);

    // Add metadata and invitaion array to return array
    if (xmlObject?.userinvitations) {
      // Create the return array
      const invitationList: GetUserInvitation = {
        userInvitations: {
          attr: {
            currentPage: Number(xmlObject.userinvitations.attr.currentpage),
            pageCount: Number(xmlObject.userinvitations.attr.pagecount),
            itemsOnPage: Number(xmlObject.userinvitations.attr.itemsonpage),
            itemsOnPages: Number(xmlObject.userinvitations.attr.itemsonpages)
          },
          userInvitation: []
        }
      };

      if (xmlObject.userinvitations.userinvitation) {
        // If there is only one invitation, make it an array to simplify the processing
        const userInvitations = forceArray(xmlObject.userinvitations.userinvitation);

        // Loop through the invitations and add them to the return array
        for (const invitation of userInvitations) {
          invitationList.userInvitations.userInvitation.push({
            attr: { netvisorkey: Number(invitation.attr.netvisorkey) },
            company: { value: invitation.company.value, attr: { netvisorkey: Number(invitation.company.attr.netvisorkey) } },
            firstNames: invitation.firstnames,
            lastName: invitation.lastname,
            existingNetvisorUser: invitation.existingnetvisoruser || undefined,
            invitationFirstNames: invitation.invitationfirstnames,
            invitationLastName: invitation.invitationlastname,
            invitationEmail: invitation.invitationemail,
            invitationPhone: invitation.invitationphone,
            invitationType: invitation.invitationtype,
            invitationStatus: invitation.invitationstatus,
            invitationCreatedTimestamp: invitation.invitationcreatedtimestamp,
            invitationCreatedBy: invitation.invitationcreatedby,
            invitationExpirationTimestamp: invitation.invitationexpirationtimestamp,
            authenticationTimestamp: invitation.authenticationtimestamp || undefined,
            verifiedTimestamp: invitation.verifiedtimestamp || undefined,
            verifiedBy: invitation.verifiedby || undefined
          });
        }
      }

      return invitationList;
    } else {
      throw new Error('Invalid XML response structure: Missing userinvitations');
    }
  }

  /**
   * Send a user invitation
   * @param invitationData - Data for the user invitation
   * @returns The id of the created invitation, or empty string if the invitation was not created successfully
   */
  async sendUserInvitation(invitationData: SendUserInvitation): Promise<string> {
    // Send the xml data to Netvisor and get the response
    const responseXml = await this._client.post(
      'senduserinvitation.nv',
      buildXml({ root: { sendUserInvitation: reorderProperties(invitationData, 'SendUserInvitation') } })
    );
    // Parse the response xml to js object
    const responseObject = parseXml(responseXml);
    if (responseObject?.replies?.inserteddataidentifier) {
      return responseObject.replies.inserteddataidentifier;
    } else {
      return '';
    }
  }

  /**
   * Cancel a user invitation
   * @param invitationData - Data for the user invitation to be cancelled. Only netvisorKey is required
   * @returns True if the invitation was cancelled successfully, false otherwise
   */
  async cancelUserInvitation(invitationData: CancelUserInvitation): Promise<boolean> {
    // Send the xml data to Netvisor and get the response
    const responseXml = await this._client.post(
      'canceluserinvitation.nv',
      buildXml({ root: { cancelUserInvitation: reorderProperties(invitationData, 'CancelUserInvitation') } })
    );
    // Parse the response xml to js object
    const responseObject = parseXml(responseXml);
    if (responseObject?.replies?.updateddataidentifier === invitationData.netvisorKey.toString()) {
      return true;
    }
    return false;
  }

  /**
   * Verify a user invitation
   * @param invitationData - Data for the user invitation to be verified. Only netvisorKey is required
   * @returns True if the invitation was verified successfully, false otherwise
   */
  async verifyUserInvitation(invitationData: VerifyUserInvitation): Promise<boolean> {
    // Send the xml data to Netvisor and get the response
    const responseXml = await this._client.post(
      'verifyuserinvitation.nv',
      buildXml({ root: { verifyUserInvitation: reorderProperties(invitationData, 'VerifyUserInvitation') } })
    );
    // Parse the response xml to js object
    const responseObject = parseXml(responseXml);
    if (responseObject?.replies?.updateddataidentifier === invitationData.netvisorKey.toString()) {
      return true;
    }
    return false;
  }
}
