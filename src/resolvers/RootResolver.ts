import { Ride } from '../entities/index.js'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ID,
  Int,
  InputType,
  Field,
} from "type-graphql";

@InputType()
class CreateRideInput {
  @Field()
  name!: string;

  @Field()
  start_date!: string;

  @Field()
  start_date_registration!: string;

  @Field()
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
    @Arg("password") password: string
  ): Promise<string | null> {
    return "jwt-token";
  }

  @Query(() => [Ride])
  async rides(
    @Arg("offset", () => Int) offset: number,
    @Arg("pageSize", () => Int) pageSize: number
  ): Promise<Ride[]> {
    return [];
  }

  @Query(() => [Ride])
  async subscribedRides(@Arg("jwt") jwt: string): Promise<Ride[]> {
    return [];
  }

  @Query(() => [Ride])
  async createdRides(@Arg("jwt") jwt: string): Promise<Ride[]> {
    return [];
  }

  @Mutation(() => ID)
  async createUser(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    return "user-id";
  }

  @Mutation(() => ID)
  async createRide(
    @Arg("jwt") jwt: string,
    @Arg("ride") ride: CreateRideInput
  ): Promise<string> {
    return "ride-id";
  }

  @Mutation(() => Boolean)
  async subscribe(
    @Arg("jwt") jwt: string,
    @Arg("rideId") rideId: string
  ): Promise<boolean> {
    return true;
  }
}
