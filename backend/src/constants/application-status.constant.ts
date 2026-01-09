export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export const ApplicationTimelineAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  SUBMIT: 'SUBMIT',
  REVIEW: 'REVIEW',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
} as const;

export type ApplicationTimelineAction =
  typeof ApplicationTimelineAction[keyof typeof ApplicationTimelineAction];