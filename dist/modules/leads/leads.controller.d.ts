import { LeadsService } from './leads.service';
import { CreateLeadDto } from '../../dto/create-lead.dto';
import { LeadFilterDto } from '../../dto/lead-filter.dto';
import { LeadTimelineDto } from '../../dto/lead-timeline.dto';
export declare class LeadsController {
    private readonly service;
    constructor(service: LeadsService);
    create(dto: CreateLeadDto): Promise<{
        success: boolean;
    }>;
    list(filters: LeadFilterDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        source: string;
        status: string;
        owner_id: string;
        updatedAt: Date;
    }[]>;
    detail(id: string): Promise<{
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
    timeline(id: string, query: LeadTimelineDto): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        action: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        lead_id: string;
    }[]>;
    updateLead(id: string, body: any, req: any): Promise<{
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
    createByCounsellor(dto: CreateLeadDto, req: any): Promise<{
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
    assignCounsellor(leadId: string, body: {
        counsellorId: string;
    }, req: any): Promise<{
        success: boolean;
    }>;
}
