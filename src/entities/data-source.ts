import { DataSource } from "typeorm"
import { User, Ride, SubscribedRide } from './index.js'

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "riderize",
  synchronize: false,
  logging: true,
  entities: [User, Ride, SubscribedRide],
  subscribers: [],
  migrations: [],
})
