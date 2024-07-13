import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AwsModule } from '../aws/aws.module';
import { EmailController } from './email.controller';
import { ResendModule } from '../resend/resend.module';

@Module({
  imports: [AwsModule, ResendModule], // , AwsSesService >> import AWSModule
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
