import { token } from '@hapi/jwt'
import InvariantError from '../exceptions/InvariantError.js'

class TokenService {
  async generateAccessToken (payload) {
    return token.generate(payload, process.env.JWT_SECRET_ACCESS)
  }

  async generateRefreshToken (payload) {
    return token.generate(payload, process.env.JWT_SECRET_REFRESH)
  }

  async checkRefreshToken (refreshToken) {
    try {
      const artifacts = token.decode(refreshToken)

      token.verifySignature(artifacts, process.env.JWT_SECRET_REFRESH)

      return artifacts.decoded.payload
    } catch (error) {
      throw new InvariantError('Refresh token is invalid')
    }
  }
}
export default TokenService
