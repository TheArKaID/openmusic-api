import routes from './route.js'

const name = 'albums'
const version = '1.0.0'
const register = async function (server) {
  server.route(routes())
}
export default { register, name, version }
