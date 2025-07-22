import 'reflect-metadata'
import express from 'express'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { UserResolver, RideResolver, RootResolver } from './resolvers/index.js'
import Context from './context'

import { buildSchema } from 'type-graphql'
const schema = await buildSchema({
  resolvers: [UserResolver, RideResolver, RootResolver],
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
      // get jwt from req.headers.authorization here
      // const token = req.headers.authorization?.split(' ')[1];
      // const userId = token ? verifyToken(token) : null;
      return { userId: 'placeholder' };
    },

  })
)

app.get('/', (_, res) => {
  res.redirect('https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:8000/graphql')
})

app.listen(8000, () => {
  console.log('🚀 Server running at http://localhost:8000/graphql')
})
