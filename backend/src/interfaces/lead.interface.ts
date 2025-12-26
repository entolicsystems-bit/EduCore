import { LeadStatus } from '../constants/lead.constants';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  status: LeadStatus;
  owner_id?: string;
}
