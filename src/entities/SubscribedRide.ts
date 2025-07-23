import { ObjectType, Field } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Ride, User } from './index.js'

@ObjectType()
@Entity({ name: "subscriptions", schema: "riderize" })
export default class SubscribedRide {
  @PrimaryGeneratedColumn("uuid")
  user_id!: string

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.subscribedRides)
  @Field(() => User)
  user!: User

  @PrimaryGeneratedColumn("uuid")
  ride_id!: string

  @JoinColumn({ name: 'ride_id' })
  @ManyToOne(() => Ride, (ride) => ride.subscribers)
  @Field(() => Ride)
  ride!: Ride

  @Field()
  @Column()
  subscription_date!: Date
}
