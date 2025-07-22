import { Resolver, FieldResolver, Root } from "type-graphql";
import { User, Ride, SubscribedRides } from '../entities/index.js'

@Resolver(User)
export default class UserResolver {
  @FieldResolver(() => [Ride])
  async rides(@Root() user: User): Promise<Ride[]> {
    return [];
  }

  @FieldResolver(() => [SubscribedRides])
  async subscribedRides(@Root() user: User): Promise<Ride[]> {
    return [];
  }
}
