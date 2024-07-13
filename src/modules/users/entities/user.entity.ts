import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Otp } from 'src/auth/entities/otp.entity';
import { UserRoleEnum } from 'src/common/enums/role.enum';
import { AbstractEnttiy } from 'src/database/abstract.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class User extends AbstractEnttiy<User> {
  @Field({ nullable: true })
  @Column({ type: 'nvarchar', nullable: true })
  name: string;

  @Column({ type: 'mediumtext', nullable: true })
  @Field({ nullable: true })
  image: string;

  @Column({ type: 'nvarchar', nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ type: 'nvarchar', nullable: true })
  @Field({ nullable: true })
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => GraphQLISODateTime, { nullable: true })
  emailVerified: Date;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  @Field(() => UserRoleEnum, { defaultValue: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Field(() => [Otp], { nullable: true })
  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];
}
