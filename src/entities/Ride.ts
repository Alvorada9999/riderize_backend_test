import { ObjectType, Field, ID } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm"
import { User } from './index.js'

@ObjectType()
@Entity()
export default class Ride {
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Field()
  @Column()
  user_id!: string

  @Field()
  @Column()
  name!: string

  @Field()
  @Column()
  start_date!: string

  @Field()
  @Column()
  start_date_registration!: string

  @Field()
  @Column()
  end_date_registration!: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  additional_information?: string

  @Field()
  @Column()
  start_place!: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  participants_limit?: number

  @Field(type => [User]!)
  @Column()
  subscribers!: User[]
}
