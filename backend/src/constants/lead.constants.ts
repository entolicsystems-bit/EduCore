export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  FOLLOW_UP = 'FOLLOW_UP',
  CONVERTED = 'CONVERTED',
  DROPPED = 'DROPPED',
}

export const LeadTimelineAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  IMPORT: 'IMPORT',
  ASSIGN: 'ASSIGN',
} as const;

export type LeadTimelineAction =
  typeof LeadTimelineAction[keyof typeof LeadTimelineAction];
