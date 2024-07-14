import { IsDate, IsOptional } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  emailVerified?: Date;
}
