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
import { Validate, MaxLength } from 'class-validator'
import { IsISOWithTimezone, IsAuthenticated, IsValidEmail } from './validators/index.js'
import { DateTime } from 'luxon'
import { env } from '../env.js'

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

@InputType()
class CreateUserInput {
  @Field()
  name!: string;

  @Field()
  @Validate(IsValidEmail)
  email!: string;

  @Field()
  @MaxLength(320)
  password!: string;
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
    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  }

  @Query(() => [Ride], { nullable: 'items' })
  async rides(
    @Arg("offset", () => Int) offset: number,
    @Arg("pageSize", () => Int) pageSize: number,
    @Ctx() ctx: Context
  ): Promise<Ride[]> {
    const cachedResult = await ctx.cache.get(`paged_rides${offset}_${pageSize}`)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    } else {
      const result = await ctx.rideRepo.find({
        skip: offset,
        take: pageSize,
        order: {
          start_date: "DESC",
        }
      });
      await ctx.cache.set(`paged_rides${offset}_${pageSize}`, JSON.stringify(result), Number(env.CACHE_TIME))
      return result
    }
  }

  @Query(() => [SubscribedRide], { nullable: 'items' })
  @UseMiddleware(IsAuthenticated)
  async subscribedRides(
    @Ctx() ctx: AuthenticatedContext,
  ): Promise<SubscribedRide[]> {
    const cachedResult = await ctx.cache.get(`subscribed_rides_${ctx.jwtPayload.userId}`)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    } else {
      const result = ctx.subscribedRideRepo.find({
        where: { user_id: ctx.jwtPayload.userId },
        relations: ["ride", "user"]
      })
      await ctx.cache.set(`subscribed_rides_${ctx.jwtPayload.userId}`, JSON.stringify(result), Number(env.CACHE_TIME))
      return result
    }
  }

  @Query(() => [Ride], { nullable: 'items' })
  @UseMiddleware(IsAuthenticated)
  async createdRides(
    @Ctx() ctx: AuthenticatedContext,
  ): Promise<Ride[]> {
    const cachedResult = await ctx.cache.get(`created_rides_${ctx.jwtPayload.userId}`)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    } else {
      const result = ctx.rideRepo.find({
        where: { user_id: ctx.jwtPayload.userId },
        relations: ["user"]
      })
      await ctx.cache.set(`created_rides_${ctx.jwtPayload.userId}`, JSON.stringify(result), Number(env.CACHE_TIME))
      return result
    }
  }

  @Mutation(() => ID)
  async createUser(
    @Arg("user") user: CreateUserInput,
    @Ctx() ctx: Context
  ): Promise<string> {
    const result = await ctx.userRepo.findBy({ email: user.email })
    if (result.length > 0) throw new Error('Email already in use')
    const hashedPassword = await argon2.hash(user.password)
    const createdUser = ctx.userRepo.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });

    await ctx.userRepo.save(createdUser);
    return createdUser.id
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
    const end_date_registration_Date = DateTime.fromJSDate(ride.end_date_registration, { zone: "utc" })
    const nowPlus30 = DateTime.utc().plus({ seconds: 30 })
    if (nowPlus30 > end_date_registration_Date) {
      throw new Error('Subscription time execed')
    }
    const start_date_registration_Date = DateTime.fromJSDate(ride.start_date_registration, { zone: "utc" })
    if (nowPlus30 < start_date_registration_Date) {
      throw new Error('Subscription time not yet achieved')
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
