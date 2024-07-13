import { PartialType } from '@nestjs/mapped-types';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoleEnum } from 'src/common/enums/role.enum';

@InputType()
export class RegisterDto {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  @IsOptional()
  name?: string;

  // make nullable true
  @Field()
  @IsOptional()
  @IsEnum(UserRoleEnum, { message: 'Invalid role, only admin or user' })
  role?: UserRoleEnum;
}
