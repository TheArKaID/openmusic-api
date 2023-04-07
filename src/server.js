import * as dotenv from 'dotenv'
import { server as _server } from '@hapi/hapi'
import jwt from '@hapi/jwt'
import ClientError from './exceptions/ClientError.js'
import albums from './api/albums/index.js'
import songs from './api/songs/index.js'
import users from './api/users/index.js'
import authentications from './api/authentications/index.js'
import playlists from './api/playlists/index.js'
import collaborations from './api/collaborations/index.js'

dotenv.config()
const init = async () => {
  const server = _server({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 6071,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register(jwt)

  server.auth.strategy('jwt_auth', 'jwt', {
    keys: process.env.JWT_SECRET_ACCESS,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.JWT_MAX_AGE
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        Credentials: {
          id: artifacts.decoded.payload.id
        }
      }
    }
  })

  await server.register([
    albums,
    songs,
    users,
    authentications,
    playlists,
    collaborations
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      let errRes = {}
      let errCode = 500

      if (response instanceof ClientError) {
        errCode = response.statusCode ?? 400
        errRes = {
          status: 'fail',
          message: response.message
        }
      } else if (!response.isServer) {
        errCode = response.output.statusCode ?? 400
        errRes = {
          status: 'fail',
          message: response.message
        }
      } else {
        errRes = {
          status: 'error',
          message: 'Server Cannot Process Your Request'
        }
        if (process.env.NODE_ENV === 'development') {
          console.log(response.message)
          errRes.data = response.message
        }
      }

      return h.response(errRes).code(errCode)
    }

    return h.continue
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

init()
