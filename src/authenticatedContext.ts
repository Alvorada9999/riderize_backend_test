import { JwtPayload } from 'jsonwebtoken'
import Context from './context'

export default interface AuthenticatedContext extends Context {
  jwtPayload: JwtPayload
}
