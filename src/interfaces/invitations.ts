export type InvitationType = 'Employee' | 'NewUser';
export type InvitationStatus = 'WaitingForAuth' | 'Authenticated' | 'Verified' | 'EmailSendingFailed' | 'SmsSendingFailed' | 'TwoFaFailed';

/*
 * RESOURCE
 * getuserinvitations.nv
 */

export interface GetUserInvitationParameters {
  page?: number;
  itemsOnPage?: number;
  company?: number;
  netvisorKeys?: number[];
  invitationTypes?: InvitationType[];
  /** If not given, Authenticated & WaitingForAuth are used by default */
  invitationStatuses?: InvitationStatus[];
  invitationEmail?: string;
  invitationPhone?: string;
  invitationFirstNames?: string;
  invitationLastNames?: string;
}

export interface GetUserInvitation {
  userInvitations: {
    attr: {
      currentPage: number;
      pageCount: number;
      itemsOnPage: number;
      itemsOnPages: number;
    };
    userInvitation: {
      attr: { netvisorkey: number };
      company: { value: string; attr: { netvisorkey: number } };
      firstNames: string;
      lastName: string;
      existingNetvisorUser?: string;
      invitationFirstNames: string;
      invitationLastName: string;
      invitationEmail: string;
      invitationPhone: string;
      invitationType: InvitationType;
      invitationStatus: InvitationStatus;
      /** Format YYYY-MM-DD HH:mm */
      invitationCreatedTimestamp: string;
      invitationCreatedBy: string;
      /** Format YYYY-MM-DD HH:mm */
      invitationExpirationTimestamp: string;
      /** Format YYYY-MM-DD HH:mm */
      authenticationTimestamp?: string;
      /** Format YYYY-MM-DD HH:mm */
      verifiedTimestamp?: string;
      verifiedBy?: string;
    }[];
  };
}

/*
 * RESOURCE
 * senduserinvitation.nv
 */

export interface SendUserInvitation {
  type: InvitationType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Netvisor key of the company the user is invited to */
  company: number;
  user?: {
    value: string;
    attr: { netvisorKey: number };
  };
}

/*
 * RESOURCE
 * canceluserinvitation.nv
 */

export interface CancelUserInvitation {
  /** Netvisor key of the invitation to be cancelled */
  netvisorKey: number;
}

/*
 * RESOURCE
 * verifyuserinvitation.nv
 */

export interface VerifyUserInvitation {
  /** Netvisor key of the invitation to be verified */
  netvisorKey: number;
}
