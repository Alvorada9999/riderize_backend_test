import { MiddlewareFn } from 'type-graphql'
import AuthenticatedContext from '../../authenticatedContext.js'

const IsAuthenticated: MiddlewareFn<AuthenticatedContext> = async ({ context }, next) => {
  if (!context.jwtPayload) {
    throw new Error("Not authenticated")
  }
  return next()
}
export default IsAuthenticated
