import { BadRequestException, Injectable } from '@nestjs/common';
import { ResendEmailDto } from './dto/resend-email.dto';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private readonly resendClient;

  constructor(private readonly configService: ConfigService) {
    this.resendClient = new Resend(this.configService.get('resend.apiKey'));
  }

  async sendVerificationEmail(resendEmailDto: ResendEmailDto) {
    console.log(this.configService.get('resend.from'));
    const { data, error } = await this.resendClient.emails.send({
      from: this.configService.get('resend.from'),
      to: resendEmailDto.ToAddresses,
      subject: 'Verify Your Email Address',
      html: `Hello ${resendEmailDto.ToAddresses[0]},\n\nThank you for registering with our service. Please verify your email address by clicking on the link below:\n\n${resendEmailDto.linkOrOtp}\n\nIf you did not create an account with us, please ignore this email.\n\nThanks,\nYour Application Team`,
    });

    if (error) {
      return new BadRequestException(error);
    }
    return data;
  }

  async sendResetEmail(resendEmailDto: ResendEmailDto) {
    const { data, error } = await this.resendClient.emails.send({
      from: this.configService.get('resend.from'),
      to: resendEmailDto.ToAddresses,
      subject: 'Reset Your Password',
      html: `Hello ${resendEmailDto.ToAddresses[0]},\n\n 
      We received a request to reset your password. Click the link below to reset it:\n\n
      ${resendEmailDto.linkOrOtp}\n\nIf you didn't request this, please ignore this email.\n\n
      
      Thanks,\n
      Your Application Team`,
    });

    if (error) {
      return new BadRequestException(error);
    }

    return data;
  }
}
