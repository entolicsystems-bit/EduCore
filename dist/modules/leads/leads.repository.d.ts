import { PrismaService } from '../../database/prisma.service';
export declare class LeadsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createLead(data: any): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        source: string;
        status: string;
        owner_id: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findLeads(filters: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        source: string;
        status: string;
        owner_id: string;
        updatedAt: Date;
    }[]>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        source: string;
        status: string;
        owner_id: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    addActivity(leadId: string, action: string, metadata?: any): import(".prisma/client").Prisma.Prisma__LeadActivityClient<{
        id: string;
        createdAt: Date;
        action: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        lead_id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getTimeline(lead_id: string, page?: number, limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        action: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        lead_id: string;
    }[]>;
    bulkInsertLeads(data: any[]): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    bulkInsertActivities(data: any[]): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    updateLeadOwner(leadId: string, ownerId: string): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        source: string;
        status: string;
        owner_id: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateLeadFields(leadId: string, data: any): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        source: string;
        status: string;
        owner_id: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateLead(leadId: string, ownerId: string): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        name: string;
        phone: string;
        email: string | null;
        source: string;
        status: string;
        owner_id: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
