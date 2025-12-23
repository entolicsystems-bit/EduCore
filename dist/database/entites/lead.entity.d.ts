import { LeadStatus } from '../../constants/lead.constants';
export declare class LeadEntity {
    id: string;
    name: string;
    phone: string;
    email?: string;
    source: string;
    status: LeadStatus;
    owner_id?: string;
    created_at: Date;
    updated_at: Date;
}
