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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const leads_repository_1 = require("./leads.repository");
const csv_util_1 = require("../../utils/csv.util");
const lead_constants_1 = require("../../constants/lead.constants");
let LeadsService = class LeadsService {
    constructor(repo) {
        this.repo = repo;
    }
    async createLead(dto, userId) {
        const lead = await this.repo.createLead({
            ...dto,
            owner_id: userId,
        });
        await this.repo.bulkInsertActivities([
            {
                lead_id: lead.id,
                action: lead_constants_1.LeadTimelineAction.CREATE,
                metadata: { performedBy: userId },
            },
        ]);
        return lead;
    }
    async createWebsiteLead(dto) {
        const lead = await this.repo.createLead({
            ...dto,
            owner_id: null,
            status: 'NEW',
        });
        await this.repo.addActivity(lead.id, 'CREATE', {
            source: 'WEBSITE',
        });
        return { success: true };
    }
    getLeads(filters) {
        return this.repo.findLeads(filters);
    }
    async getLead(id) {
        const [lead, timeline] = await Promise.all([
            this.repo.findById(id),
            this.repo.getTimeline(id, 1, 10),
        ]);
        if (!lead)
            throw new common_1.BadRequestException('Lead not found');
        return { lead, timeline };
    }
    async importCsv(file, userId) {
        const rows = await (0, csv_util_1.parseCsv)(file.buffer);
        if (rows.length > 10000) {
            throw new common_1.BadRequestException('CSV limit exceeded');
        }
        const leads = rows.map(row => ({
            ...row,
            owner_id: userId,
        }));
        await this.repo.bulkInsertLeads(leads);
        const activities = leads.map(row => ({
            lead_id: row.id,
            action: lead_constants_1.LeadTimelineAction.IMPORT,
            metadata: { performedBy: userId },
        }));
        await this.repo.bulkInsertActivities(activities);
        return { inserted: leads.length };
    }
    async createCounsellorLead(dto, counsellorId) {
        const lead = await this.repo.createLead({
            ...dto,
            owner_id: counsellorId,
            status: 'NEW',
        });
        await this.repo.addActivity(lead.id, lead_constants_1.LeadTimelineAction.CREATE, {
            source: 'COUNSELLOR',
            performedBy: counsellorId,
        });
        return lead;
    }
    async assignCounsellor(leadId, counsellorId, adminId) {
        const lead = await this.repo.findById(leadId);
        if (!lead)
            throw new common_1.BadRequestException('Lead not found');
        await Promise.all([
            this.repo.updateLeadOwner(leadId, counsellorId),
            this.repo.bulkInsertActivities([
                {
                    lead_id: leadId,
                    action: lead_constants_1.LeadTimelineAction.ASSIGN,
                    metadata: {
                        performedBy: adminId,
                        assignedTo: counsellorId,
                    },
                },
            ]),
        ]);
        return { success: true };
    }
    getLeadTimeline(leadId, query) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 10, 50);
        return this.repo.getTimeline(leadId, page, limit);
    }
    async updateLead(leadId, dto, user) {
        const lead = await this.repo.findById(leadId);
        if (!lead) {
            throw new common_1.BadRequestException('Lead not found');
        }
        if (user.role === 'COUNSELLOR') {
            if (lead.owner_id !== user.id) {
                throw new common_1.ForbiddenException('You can update only your assigned leads');
            }
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.phone !== undefined)
            data.phone = dto.phone;
        if (dto.email !== undefined)
            data.email = dto.email;
        if (dto.status !== undefined)
            data.status = dto.status;
        if (dto.source !== undefined)
            data.source = dto.source;
        const updatedLead = await this.repo.updateLeadFields(leadId, data);
        await this.repo.addActivity(leadId, lead_constants_1.LeadTimelineAction.UPDATE, {
            updatedBy: user.id,
            role: user.role,
            changes: data,
        });
        return updatedLead;
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leads_repository_1.LeadsRepository])
], LeadsService);
//# sourceMappingURL=leads.service.js.map