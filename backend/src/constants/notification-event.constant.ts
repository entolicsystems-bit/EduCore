export const NotificationEvents = {
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  DOCUMENT_VERIFIED: 'DOCUMENT_VERIFIED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  OFFER_LETTER_READY: 'OFFER_LETTER_READY',
  STUDENT_ENROLLED: 'STUDENT_ENROLLED',
} as const;

export type NotificationEvent =
  typeof NotificationEvents[keyof typeof NotificationEvents];
