import SongHandler from './handler.js'

const handler = new SongHandler()

const routes = () => [
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.postSongHandler(request, h)
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handler.getSongsHandler(request, h)
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request, h) => handler.getSongByIdHandler(request, h)
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handler.editSongHandler(request, h)
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handler.deleteSongHandler(request, h)
  }
]

export default routes
