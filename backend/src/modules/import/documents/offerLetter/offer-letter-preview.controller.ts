import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { OfferLetterService } from "./offer-letter.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/common/decorator/roles.decorator";
import { Response } from "express";

@Controller("v1/offer-letter")
export class offerLetterpreviewController {
  constructor(private readonly offerletterService: OfferLetterService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get(":id/offerletter")
  async getOfferletter(
    @Param("id") applicationId: string,
    @Res() res: Response
  ) {
    const { html } = await this.offerletterService.preview(applicationId);
    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  }
}
