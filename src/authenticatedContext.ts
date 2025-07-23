import { JwtPayload } from 'jsonwebtoken'
import Context from './context'
import { Keyv } from 'keyv';

export default interface AuthenticatedContext extends Context {
  jwtPayload: JwtPayload
  cache: Keyv
}
