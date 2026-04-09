/*
 * RESOURCE
 * getuserinvitation.nv
 */

export type InvitationType = 'Employee' | 'NewUser';
export type InvitationStatus = 'WaitingForAuth' | 'Authenticated' | 'Verified' | 'EmailSendingFailed' | 'SmsSendingFailed' | 'TwoFaFailed';

export interface GetUserInvitationParameters {
  page?: number;
  itemsOnPage?: number;
  company?: number;
  netvisorKeys?: number[];
  invitationTypes?: InvitationType[];
  /** If not given, Authenticated & WaitingForAuth are used by default */
  invitationStatuses?: InvitationStatus[];
  invitationMail?: string;
  invitationPhone?: string;
  invitationFirstNames?: string;
  invitationLastNames?: string;
}

export interface GetUserInvitation {
  userInvitations: {
    company: string | { value: string; attr: { netvisorkey: number } };
    firstNames: string;
  }[];
}

/*
 * RESOURCE
 * senduserinvitation.nv
 */

export interface SendUserInvitation {}

/*
 * RESOURCE
 * canceluserinvitation.nv
 */

export interface CancelUserInvitation {}

/*
 * RESOURCE
 * verifyuserinvitation.nv
 */

export interface VerifyUserInvitation {}
