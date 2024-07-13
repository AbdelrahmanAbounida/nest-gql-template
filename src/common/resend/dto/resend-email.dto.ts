import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { SendSESEmailDTO } from 'src/common/aws/dtos/ses.dto';

export class ResendEmailDto {
  @IsString()
  @IsNotEmpty()
  linkOrOtp: string; // reset/verify link u send with the email  >> here will be otp

  @IsNotEmpty()
  @IsEmail({}, { each: true })
  @IsArray()
  @ArrayMaxSize(50) // reciepients can't exceed 50 at a time
  @ArrayNotEmpty()
  ToAddresses: string[];
}
