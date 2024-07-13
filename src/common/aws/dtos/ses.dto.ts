import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { EmailTemplateEnum } from '../aws.constant';

export class CreateTemplateDTO {
  // @IsObject()
  @IsString()
  @IsOptional()
  htmlBody: string;

  @IsString()
  @IsOptional()
  textBody: string;

  @IsString()
  @IsNotEmpty()
  templateSubject: string;

  @IsString()
  @IsEnum(EmailTemplateEnum)
  templateName: keyof typeof EmailTemplateEnum; // make it string
}

export class UpdateTemplateDTO extends CreateTemplateDTO {}

export class SendSESEmailDTO {
  @IsEnum(EmailTemplateEnum)
  @IsOptional()
  templateType: keyof typeof EmailTemplateEnum; // The name of an existing template in Amazon SES.

  // @IsUrl()
  @IsString()
  @IsNotEmpty()
  linkOrOtp: string; // reset/verify link u send with the email  >> here will be otp

  @IsNotEmpty()
  @IsEmail({}, { each: true })
  @IsArray()
  @ArrayMaxSize(50) // reciepients can't exceed 50 at a time
  @ArrayNotEmpty()
  ToAddresses: string[];

  @IsOptional()
  @IsEmail(null, { each: true })
  @IsArray()
  cc?: string[];

  // @IsString()
  // url: string;
}

export class DeleteTemplateDTO {
  @IsString()
  @IsNotEmpty()
  templateName: keyof typeof EmailTemplateEnum;
}
