import { ObjectType, Field } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Ride } from './index.js'

@ObjectType()
@Entity()
export default class SubscribedRides {
  @PrimaryGeneratedColumn("uuid")
  user_id!: string

  @PrimaryGeneratedColumn("uuid")
  ride_id!: string

  @Field(type => [Ride]!)
  ride!: Ride[]

  @Column()
  subscription_date!: string
}
