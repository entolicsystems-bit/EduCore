// import {
//   Controller,
//   Post,
//   Body,
//   BadRequestException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { EmailService } from './email.service';

// @Controller('email')
// export class EmailController {
//   constructor(private readonly emailService: EmailService) {}

//   @Post('test')
//   async testEmail(@Body() body: any) {
//     try {
//       console.log('📩 Incoming body:', body);

//       if (!body?.to) {
//         throw new BadRequestException('Recipient email (to) is required');
//       }

//       await this.emailService.sendTestEmail(body.to);

//       return {
//         success: true,
//         message: `Email sent to ${body.to}`,
//       };
//     } catch (error) {
//       console.error('🔥 EMAIL CONTROLLER ERROR:', error);

//       // show readable error in Postman
//       throw new InternalServerErrorException({
//         message: error.message,
//         code: error.code,
//         response: error.response,
//       });
//     }
//   }
// }
