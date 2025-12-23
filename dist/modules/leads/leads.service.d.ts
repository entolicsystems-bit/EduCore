import { LeadsRepository } from './leads.repository';
import { CreateLeadDto } from '../../dto/create-lead.dto';
import { LeadFilterDto } from '../../dto/lead-filter.dto';
export declare class LeadsService {
    private readonly repo;
    constructor(repo: LeadsRepository);
    createLead(dto: CreateLeadDto, userId: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        source: string;
        status: string;
        owner_id: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createWebsiteLead(dto: CreateLeadDto): Promise<{
        success: boolean;
    }>;
    getLeads(filters: LeadFilterDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        source: string;
        status: string;
        owner_id: string;
        updatedAt: Date;
    }[]>;
    getLead(id: string): Promise<{
        lead: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            source: string;
            status: string;
            owner_id: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        timeline: {
            id: string;
            createdAt: Date;
            action: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            lead_id: string;
        }[];
    }>;
    importCsv(file: Express.Multer.File, userId: string): Promise<{
        inserted: number;
    }>;
    createCounsellorLead(dto: CreateLeadDto, counsellorId: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        source: string;
        status: string;
        owner_id: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    assignCounsellor(leadId: string, counsellorId: string, adminId: string): Promise<{
        success: boolean;
    }>;
    getLeadTimeline(leadId: string, query: {
        page?: number;
        limit?: number;
    }): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        action: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        lead_id: string;
    }[]>;
    updateLead(leadId: string, dto: any, user: {
        id: string;
        role: string;
    }): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        source: string;
        status: string;
        owner_id: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
