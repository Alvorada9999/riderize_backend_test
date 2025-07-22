import { Resolver, FieldResolver, Root } from 'type-graphql'
import { User, Ride } from '../entities/index.js'

@Resolver(Ride)
export default class RideResolver {
  @FieldResolver(() => [User])
  async subscribers(@Root() ride: Ride): Promise<User[]> {
    return []
  }
}
