import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';

@Entity()
@ObjectType({ isAbstract: true })
export class AbstractEnttiy<T> {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => GraphQLISODateTime, { nullable: false })
  createdAt: Date;

  @Column({ type: 'datetime', onUpdate: 'CURRENT_TIMESTAMP', nullable: true }) // , default: () => 'CURRENT_TIMESTAMP'
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
