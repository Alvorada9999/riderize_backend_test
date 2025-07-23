import { DataSource } from "typeorm"
import { User, Ride, SubscribedRide } from './index.js'
import { env } from '../env.js'

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  entities: [User, Ride, SubscribedRide],
  subscribers: [],
  migrations: [],
})
