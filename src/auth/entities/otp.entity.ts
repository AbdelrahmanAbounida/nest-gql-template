import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEnttiy } from 'src/database/abstract.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@ObjectType()
@Entity()
export class Otp extends AbstractEnttiy<Otp> {
  @Field({ nullable: true })
  @Column({ type: 'nvarchar', nullable: true })
  name: string;

  @Column({ type: 'nvarchar', nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ type: 'int', nullable: true })
  @Field(() => Number, { nullable: true })
  value: number;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  expirationDate: Date;

  @ManyToOne(() => User, (user) => user.otps)
  @Field(() => User, { nullable: true })
  user: User;
}
