import { Resolver, FieldResolver, Root, Ctx } from 'type-graphql'
import { User, Ride, SubscribedRide } from '../entities/index.js'
import Context from '../context.js';
import { env } from '../env.js'

@Resolver(Ride)
export default class RideResolver {
  @FieldResolver(() => [SubscribedRide])
  async subscribers(
    @Root() ride: Ride,
    @Ctx() ctx: Context
  ): Promise<SubscribedRide[] | null> {
    const cachedResult = await ctx.cache.get(`ride_subscribers_${ride.id}`)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    } else {
      const result = await ctx.subscribedRideRepo.find({
        where: { ride_id: ride.id },
        relations: ["user", "ride"],
      })
      await ctx.cache.set(`ride_subscribers_${ride.id}`, JSON.stringify(result), Number(env.CACHE_TIME))
      return result
    }
  }
  @FieldResolver(() => User)
  async user(
    @Root() ride: Ride,
    @Ctx() ctx: Context
  ): Promise<User> {
    const cachedResult = await ctx.cache.get(`ride_user_${ride.user_id}`)
    if (cachedResult) {
      return JSON.parse(cachedResult)
    } else {
      const result = await ctx.userRepo.findOne({ where: { id: ride.user_id } }) as User
      await ctx.cache.set(`ride_user_${ride.user_id}`, JSON.stringify(result), Number(env.CACHE_TIME))
      return result
    }
  }
}
