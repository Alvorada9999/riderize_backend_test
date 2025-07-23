import { Resolver, FieldResolver, Root, Ctx, UseMiddleware } from "type-graphql";
import { User, Ride, SubscribedRide } from '../entities/index.js'
import Context from '../context.js';
import AuthenticatedContext from '../authenticatedContext.js';
import { IsAuthenticated } from './validators/index.js'
import { env } from '../env.js'

@Resolver(User)
export default class UserResolver {
  @FieldResolver(() => [Ride])
  async rides(
    @Root() user: User,
    @Ctx() ctx: Context
  ): Promise<Ride[] | null> {
    const cachedResult = await ctx.cache.get(`user_rides_${user.id}`)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    } else {
      const result = await ctx.rideRepo.find({ where: { user_id: user.id } })
      await ctx.cache.set(`user_rides_${user.id}`, JSON.stringify(result), Number(env.CACHE_TIME))
      return result
    }
  }

  @FieldResolver(() => [SubscribedRide])
  @UseMiddleware(IsAuthenticated)
  async subscribedRides(
    @Root() user: User,
    @Ctx() ctx: AuthenticatedContext
  ): Promise<SubscribedRide[]> {
    const cachedResult = await ctx.cache.get(`user_subscriptions_${ctx.jwtPayload.userId}`)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    } else {
      const result = await ctx.subscribedRideRepo.find({ where: { user_id: ctx.jwtPayload.userId }, relations: ["ride", "user"] })
      await ctx.cache.set(`user_subscriptions_${ctx.jwtPayload.userId}`, JSON.stringify(result), Number(env.CACHE_TIME))
      return result;
    }
  }
}
