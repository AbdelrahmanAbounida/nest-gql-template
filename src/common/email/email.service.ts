import { Injectable } from '@nestjs/common';
import { AwsSesService } from '../aws/services/aws.ses.service';
import { SendSESEmailDTO } from '../aws/dtos/ses.dto';
import { ResendService } from '../resend/resend.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly awsSesService: AwsSesService,
    private readonly resendService: ResendService,
  ) {}

  // send email verification OTP Methods
  async sendAWSEmailVerification(to: string, linkOrOtp: string, url: string) {
    return this.awsSesService.send({
      templateType: 'VERIFY', // should match the template name in aws ses
      ToAddresses: [to],
      linkOrOtp: linkOrOtp,
    });
  }

  async sendResendEmailVerification(
    to: string,
    linkOrOtp: string,
    url: string,
  ) {
    return this.resendService.sendVerificationEmail({
      ToAddresses: [to],
      linkOrOtp: linkOrOtp,
    });
  }

  // send password reset OTP Methods
}
