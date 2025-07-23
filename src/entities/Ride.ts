import { ObjectType, Field, ID, Int } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { User, SubscribedRide } from './index.js'

@ObjectType()
@Entity({ name: "rides", schema: "riderize" })
export default class Ride {
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.rides, { onDelete: 'CASCADE' })
  @Field(type => User)
  user!: User

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

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  participants_limit?: number

  @Field(() => [SubscribedRide], { nullable: 'items' })
  @OneToMany(() => SubscribedRide, (subscription) => subscription.ride)
  subscribers!: SubscribedRide[]
}
