import 'reflect-metadata'
import express from 'express'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { UserResolver, RideResolver, RootResolver } from './resolvers/index.js'
import Context from './context'
import AuthenticatedContext from './authenticatedContext'
import { AppDataSource, User, Ride, SubscribedRide } from './entities/index.js'
import { Repository } from "typeorm";
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken'
import { config } from './config.js'

let userRepo: Repository<User>
let rideRepo: Repository<Ride>
let subscribedRideRepo: Repository<SubscribedRide>
AppDataSource.initialize()
  .then(() => {
    userRepo = AppDataSource.getRepository(User)
    rideRepo = AppDataSource.getRepository(Ride)
    subscribedRideRepo = AppDataSource.getRepository(SubscribedRide)
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

import { buildSchema } from 'type-graphql'
const schema = await buildSchema({
  resolvers: [UserResolver, RideResolver, RootResolver],
  validate: true
})

const app = express()
app.use(express.json())

const server = new ApolloServer({
  schema,
})
await server.start()

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {

    context: async ({ req, res }): Promise<Context> => {
      const token = req.headers.authorization?.split(' ')[1];
      const context: Context = {
        userRepo,
        rideRepo,
        subscribedRideRepo
      }
      if (token) {
        try {
          let jwtPayload = jwt.verify(token, config.jwtSecret) as JwtPayload
          const authenticatedContext: AuthenticatedContext = {
            userRepo,
            rideRepo,
            subscribedRideRepo,
            jwtPayload
          }
          return authenticatedContext
        } catch (err) {
          throw new Error('Invalid credentials')
        }
      }
      return context
    },

  })
)

app.get('/', (_, res) => {
  res.redirect('https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:8000/graphql')
})

app.listen(8000, () => {
  console.log('🚀 Server running at http://localhost:8000/graphql')
})
