import routes from './route.js'

const name = 'authentications'
const version = '1.0.0'
const register = async (server) => {
  server.route(routes())
}
export default { register, name, version }
