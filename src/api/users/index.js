import routes from './route.js'

const name = 'users'
const version = '1.0.0'
async function register (server) {
  server.route(routes())
}

export default { register, name, version }
