import { ApplicationStatus } from '@prisma/client';

export const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  DRAFT: [ApplicationStatus.APPLIED],   // User submits form

  APPLIED: [ApplicationStatus.DOCUMENT_VERIFIED],  // Docs verified

  DOCUMENT_VERIFIED: [ApplicationStatus.UNDER_REVIEW],  // Counselor review

  UNDER_REVIEW: [
    ApplicationStatus.APPROVED,
    ApplicationStatus.REJECTED,
  ],

  APPROVED: [ApplicationStatus.ENROLLED], // Admission

  REJECTED: [],

  ENROLLED: [],
};
