import { Body, Controller, Delete, Post } from '@nestjs/common';
import {
  CreateTemplateDTO,
  DeleteTemplateDTO,
  SendSESEmailDTO,
} from '../aws/dtos/ses.dto';
import { AwsSesService } from '../aws/services/aws.ses.service';
import { Roles } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from '../enums/role.enum';
import { ResendService } from '../resend/resend.service';
import { ResendEmailDto } from '../resend/dto/resend-email.dto';

@Controller('email')
@Roles(UserRoleEnum.ADMIN)
export class EmailController {
  constructor(
    private readonly ses: AwsSesService,
    private readonly resendService: ResendService,
  ) {}

  @Post('create-template')
  async sendEmail(@Body() createEmailTemplate: CreateTemplateDTO) {
    return this.ses.createTemplate(createEmailTemplate);
  }
  @Delete('delete-template')
  async deleteTemplate(@Body() deleteTemplateDto: DeleteTemplateDTO) {
    return this.ses.deleteTemplate({ name: deleteTemplateDto.templateName });
  }

  @Post('test-send-aws-email')
  async testSendAwsEmail(@Body() sendSESEmailDto: SendSESEmailDTO) {
    return this.ses.send(sendSESEmailDto);
  }

  @Post('test-send-resend-email')
  async testSendResendEmail(@Body() resendEmailDto: ResendEmailDto) {
    return this.resendService.sendVerificationEmail(resendEmailDto);
  }
}
