import { ObjectType, Field, ID } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm"
import { Ride } from './index.js'

@ObjectType()
@Entity()
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

  @Column()
  password_salt!: string

  @Field(type => [Ride]!)
  rides!: Ride[]

  @Field(type => [Ride]!)
  subscribedRides!: Ride[]
}
