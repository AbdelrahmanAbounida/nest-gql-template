import { Module } from '@nestjs/common';
import { AwsSesService } from './services/aws.ses.service';

@Module({
  exports: [AwsSesService],
  providers: [AwsSesService],
})
export class AwsModule {}
