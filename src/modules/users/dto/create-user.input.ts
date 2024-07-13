import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleEnum } from 'src/common/enums/role.enum';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsString()
  @Field(() => String)
  password: string;

  @IsEnum(UserRoleEnum, { message: 'Invalid role, only admin or user' })
  @Field(() => UserRoleEnum)
  role?: UserRoleEnum;
}
