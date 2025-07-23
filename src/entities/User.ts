import { ObjectType, Field, ID } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Ride, SubscribedRide } from './index.js'

@ObjectType()
@Entity({ name: "users", schema: "riderize" })
export default class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Field()
  @Column()
  name!: string

  @Field()
  @Column()
  email!: string

  @Column()
  password!: string

  @Field(type => [Ride], { nullable: 'items' })
  @OneToMany(() => Ride, (ride) => ride.user)
  rides!: Ride[]

  @Field(() => [SubscribedRide], { nullable: 'items' })
  @OneToMany(() => SubscribedRide, (subscription) => subscription.user)
  subscribedRides!: SubscribedRide[]
}
