import { Ride, SubscribedRide } from '../entities/index.js'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ID,
  Int,
  InputType,
  Field,
  Ctx,
  UseMiddleware
} from "type-graphql";
import Context from '../context.js';
import AuthenticatedContext from '../authenticatedContext'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken';
import { Validate } from 'class-validator'
import { IsISOWithTimezone, IsAuthenticated } from './validators/index.js'
import { DateTime } from 'luxon'
import { config } from '../config.js'

@InputType()
class CreateRideInput {
  @Field()
  name!: string;

  @Field()
  @Validate(IsISOWithTimezone)
  start_date!: string;

  @Field()
  @Validate(IsISOWithTimezone)
  start_date_registration!: string;

  @Field()
  @Validate(IsISOWithTimezone)
  end_date_registration!: string;

  @Field({ nullable: true })
  additional_information?: string;

  @Field()
  start_place!: string;

  @Field(() => Int, { nullable: true })
  participants_limit?: number;
}

@Resolver()
export default class RootResolver {
  @Query(() => String, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: Context
  ): Promise<string | null> {
    const user = await ctx.userRepo.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1d' });
    return token;
  }

  @Query(() => [Ride], { nullable: 'items' })
  async rides(
    @Arg("offset", () => Int) offset: number,
    @Arg("pageSize", () => Int) pageSize: number,
    @Ctx() ctx: Context
  ): Promise<Ride[]> {
    return await ctx.rideRepo.find({
      skip: offset,
      take: pageSize,
      order: {
        start_date: "DESC",
      }
    });
  }

  @Query(() => [SubscribedRide], { nullable: 'items' })
  @UseMiddleware(IsAuthenticated)
  async subscribedRides(
    @Ctx() ctx: AuthenticatedContext,
  ): Promise<SubscribedRide[]> {
    const result = ctx.subscribedRideRepo.find({
      where: { user_id: ctx.jwtPayload.userId },
      relations: ["ride", "user"]
    })
    return result
  }

  @Query(() => [Ride], { nullable: 'items' })
  @UseMiddleware(IsAuthenticated)
  async createdRides(
    @Ctx() ctx: AuthenticatedContext,
  ): Promise<Ride[]> {
    const result = ctx.rideRepo.find({
      where: { user_id: ctx.jwtPayload.userId },
      relations: ["user"]
    })
    return result
  }

  @Mutation(() => ID)
  async createUser(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: Context
  ): Promise<string> {
    let result = await ctx.userRepo.findBy({ email: email })
    if (result.length > 0) throw new Error('Email already in use')
    const hashedPassword = await argon2.hash(password)
    const user = ctx.userRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    await ctx.userRepo.save(user);
    return user.id
  }

  @Mutation(() => ID)
  @UseMiddleware(IsAuthenticated)
  async createRide(
    @Arg("ride") ride: CreateRideInput,
    @Ctx() ctx: AuthenticatedContext,
  ): Promise<string> {
    const createdRide = ctx.rideRepo.create({
      ...ride,
      user_id: ctx.jwtPayload.userId
    });

    await ctx.rideRepo.save(createdRide);
    return createdRide.id
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuthenticated)
  async subscribe(
    @Arg("rideId") rideId: string,
    @Ctx() ctx: AuthenticatedContext
  ): Promise<boolean> {
    const ride = await ctx.rideRepo.findOne({ where: { id: rideId } })
    if (!ride) throw new Error('Ride does not exists');
    const dbDate = DateTime.fromJSDate(new Date(ride.end_date_registration), { zone: "utc" })
    const nowPlus30 = DateTime.utc().plus({ seconds: 30 })
    if (nowPlus30 > dbDate) {
      throw new Error('Subscription time execed')
    }
    const createdSubscription = ctx.subscribedRideRepo.create({
      ride_id: rideId,
      user_id: ctx.jwtPayload.userId,
      subscription_date: nowPlus30.toString()
    })
    await ctx.subscribedRideRepo.save(createdSubscription)
    return true;
  }
}
