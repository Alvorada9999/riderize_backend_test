import { Resolver, FieldResolver, Root, Ctx, UseMiddleware } from "type-graphql";
import { User, Ride, SubscribedRide } from '../entities/index.js'
import Context from '../context.js';
import AuthenticatedContext from '../authenticatedContext.js';
import { IsAuthenticated } from './validators/index.js'

@Resolver(User)
export default class UserResolver {
  @FieldResolver(() => [Ride])
  async rides(
    @Root() user: User,
    @Ctx() ctx: Context
  ): Promise<Ride[] | null> {
    let result = await ctx.rideRepo.find({ where: { user_id: user.id } })
    return result
  }

  @FieldResolver(() => [SubscribedRide])
  @UseMiddleware(IsAuthenticated)
  async subscribedRides(
    @Root() user: User,
    @Ctx() ctx: AuthenticatedContext
  ): Promise<SubscribedRide[]> {
    let result = await ctx.subscribedRideRepo.find({ where: { user_id: ctx.jwtPayload.userId } })
    return result;
  }
}
