"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let LeadsRepository = class LeadsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createLead(data) {
        return this.prisma.lead.create({ data });
    }
    findLeads(filters) {
        const page = Number(filters.page) || 1;
        const limit = Math.min(Number(filters.limit) || 20, 50);
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.source)
            where.source = filters.source;
        if (filters.owner_id)
            where.owner_id = filters.owner_id;
        if (filters.fromDate || filters.toDate) {
            where.updatedAt = {};
            if (filters.fromDate)
                where.updatedAt.gte = new Date(filters.fromDate);
            if (filters.toDate)
                where.updatedAt.lte = new Date(filters.toDate);
        }
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { phone: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.lead.findMany({
            where,
            skip,
            take: limit,
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                status: true,
                source: true,
                owner_id: true,
                updatedAt: true,
            },
        });
    }
    findById(id) {
        return this.prisma.lead.findUnique({
            where: { id },
        });
    }
    addActivity(leadId, action, metadata) {
        return this.prisma.leadActivity.create({
            data: {
                lead_id: leadId,
                action,
                metadata,
            },
        });
    }
    getTimeline(lead_id, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return this.prisma.leadActivity.findMany({
            where: { lead_id },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
    bulkInsertLeads(data) {
        return this.prisma.lead.createMany({
            data,
            skipDuplicates: true,
        });
    }
    bulkInsertActivities(data) {
        return this.prisma.leadActivity.createMany({
            data,
        });
    }
    updateLeadOwner(leadId, ownerId) {
        return this.prisma.lead.update({
            where: { id: leadId },
            data: { owner_id: ownerId },
        });
    }
    updateLeadFields(leadId, data) {
        return this.prisma.lead.update({
            where: { id: leadId },
            data,
        });
    }
    updateLead(leadId, ownerId) {
        return this.prisma.lead.update({
            where: { id: leadId },
            data: { owner_id: ownerId },
        });
    }
};
exports.LeadsRepository = LeadsRepository;
exports.LeadsRepository = LeadsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsRepository);
//# sourceMappingURL=leads.repository.js.map