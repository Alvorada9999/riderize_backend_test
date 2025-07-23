import { Resolver, FieldResolver, Root, Ctx } from 'type-graphql'
import { User, Ride, SubscribedRide } from '../entities/index.js'
import Context from '../context.js';

@Resolver(Ride)
export default class RideResolver {
  @FieldResolver(() => [SubscribedRide])
  async subscribers(
    @Root() ride: Ride,
    @Ctx() ctx: Context
  ): Promise<SubscribedRide[] | null> {
    let result = await ctx.subscribedRideRepo.find({
      where: { ride_id: ride.id },
      relations: ["user", "ride"],
    })
    return result
  }
  @FieldResolver(() => User)
  async user(
    @Root() ride: Ride,
    @Ctx() ctx: Context
  ): Promise<User> {
    let result = await ctx.userRepo.findOne({ where: { id: ride.user_id } }) as User
    return result
  }
}
