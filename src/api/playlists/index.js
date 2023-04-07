import routes from './route.js'

const name = 'playlists'
const version = '1.0.0'
async function register (server) {
  server.route(routes())
}

export default { register, name, version }
