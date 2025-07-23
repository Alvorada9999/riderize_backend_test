import { Repository } from "typeorm";
import { User, Ride, SubscribedRide } from "./entities/index.js";
import { Keyv } from 'keyv';

export default interface Context {
  userRepo: Repository<User>
  rideRepo: Repository<Ride>
  subscribedRideRepo: Repository<SubscribedRide>
  cache: Keyv
}
