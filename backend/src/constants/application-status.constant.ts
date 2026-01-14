export enum ApplicationStatus {
  APPLIED = 'APPLIED',                 // Application created & submitted
  UNDER_REVIEW = 'UNDER_REVIEW',       // Counselor reviewing
  DOCUMENT_VERIFIED = 'DOCUMENT_VERIFIED', // All documents approved
  APPROVED = 'APPROVED',               // Admission approved
  REJECTED = 'REJECTED',               // Rejected
  ENROLLED = 'ENROLLED',               // Converted to student
}

/**
 * Timeline events for ActivityTimeline
 */
export const ApplicationTimelineAction = {
  CREATE: 'CREATE',                    // Application created
  APPLY: 'APPLY',                      // Application submitted
  REVIEW: 'REVIEW',                    // Counselor started review
  DOCUMENT_VERIFIED: 'DOCUMENT_VERIFIED',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  ENROLL: 'ENROLL',
} as const;

export type ApplicationTimelineAction =
  typeof ApplicationTimelineAction[keyof typeof ApplicationTimelineAction];
