import {  Injectable,
  BadRequestException,
  ForbiddenException } from '@nestjs/common';
import { LeadsRepository } from './leads.repository';
import { CreateLeadDto } from '../../dto/create-lead.dto';
import { LeadFilterDto } from '../../dto/lead-filter.dto';
import { parseCsv } from '../../utils/csv.util';
import { LeadTimelineAction } from '../../constants/lead.constants';

@Injectable()
export class LeadsService {
  constructor(private readonly repo: LeadsRepository) {}

  async createLead(dto: CreateLeadDto, userId: string) {
    const lead = await this.repo.createLead({
      ...dto,
      owner_id: userId,
    });

    await this.repo.bulkInsertActivities([
      {
        lead_id: lead.id,
        action: LeadTimelineAction.CREATE,
        metadata: { performedBy: userId },
      },
    ]);

    return lead;
  }

  async createWebsiteLead(dto: CreateLeadDto) {
  const lead = await this.repo.createLead({
    ...dto,
    owner_id: null, // 👈 intentional
    status: 'NEW',
  });

  await this.repo.addActivity(
    lead.id,
    'CREATE',
    {
      source: 'WEBSITE',
    },
  );

  return { success: true };
}


  getLeads(filters: LeadFilterDto) {
    return this.repo.findLeads(filters);
  }

  async getLead(id: string) {
    const [lead, timeline] = await Promise.all([
      this.repo.findById(id),
      this.repo.getTimeline(id, 1, 10),
    ]);

    if (!lead) throw new BadRequestException('Lead not found');

    return { lead, timeline };
  }

  async importCsv(file: Express.Multer.File, userId: string) {
    const rows = await parseCsv(file.buffer);

    if (rows.length > 10000) {
      throw new BadRequestException('CSV limit exceeded');
    }

    const leads = rows.map(row => ({
      ...row,
      owner_id: userId,
    }));

    await this.repo.bulkInsertLeads(leads);

    const activities = leads.map(row => ({
      lead_id: row.id,
      action: LeadTimelineAction.IMPORT,
      metadata: { performedBy: userId },
    }));

    await this.repo.bulkInsertActivities(activities);

    return { inserted: leads.length };
  }

  async createCounsellorLead(dto: CreateLeadDto, counsellorId: string) {
  const lead = await this.repo.createLead({
    ...dto,
    owner_id: counsellorId, // ✅ auto assign
    status: 'NEW',
  });

  await this.repo.addActivity(
    lead.id,
    LeadTimelineAction.CREATE,
    {
      source: 'COUNSELLOR',
      performedBy: counsellorId,
    },
  );

  return lead;
}


  async assignCounsellor(
    leadId: string,
    counsellorId: string,
    adminId: string,
  ) {
    const lead = await this.repo.findById(leadId);
    if (!lead) throw new BadRequestException('Lead not found');

    await Promise.all([
      this.repo.updateLeadOwner(leadId, counsellorId),
      this.repo.bulkInsertActivities([
        {
          lead_id: leadId,
          action: LeadTimelineAction.ASSIGN,
          metadata: {
            performedBy: adminId,
            assignedTo: counsellorId,
          },
        },
      ]),
    ]);

    return { success: true };
  }

  getLeadTimeline(
    leadId: string,
    query: { page?: number; limit?: number },
  ) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 50);

    return this.repo.getTimeline(leadId, page, limit);
  }

 async updateLead(
  leadId: string,
  dto: any,
  user: { id: string; role: string },
) {
  const lead = await this.repo.findById(leadId);

  if (!lead) {
    throw new BadRequestException('Lead not found');
  }

  // 🔐 COUNSELLOR RULES
  if (user.role === 'COUNSELLOR') {
    // ❌ not assigned yet
    if (!lead.owner_id) {
      throw new ForbiddenException(
        'Lead is not assigned to you yet',
      );
    }

    // ❌ assigned to someone else
    if (lead.owner_id !== user.id) {
      throw new ForbiddenException(
        'You can update only your assigned leads',
      );
    }
  }

  // 🧼 sanitize update fields (NO owner_id allowed)
  const data: any = {};

  if (dto.name !== undefined) data.name = dto.name;
  if (dto.phone !== undefined) data.phone = dto.phone;
  if (dto.email !== undefined) data.email = dto.email;
  if (dto.status !== undefined) data.status = dto.status;
  if (dto.source !== undefined) data.source = dto.source;

  const updatedLead = await this.repo.updateLeadFields(leadId, data);

  // 🕒 timeline entry
  await this.repo.addActivity(
    leadId,
    LeadTimelineAction.UPDATE,
    {
      updatedBy: user.id,
      role: user.role,
      changes: data,
    },
  );

  return updatedLead;
}



}
