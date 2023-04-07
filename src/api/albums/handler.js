import AlbumService from '../../services/AlbumService.js'
import AlbumValidator from '../../validator/albums/index.js'
import autoBind from 'auto-bind'

class AlbumHandler {
  constructor () {
    this._service = new AlbumService()
    this._validator = new AlbumValidator()

    autoBind(this)
  }

  async postAlbumHandler (request, h) {
    const data = this._validator.validate(request.payload)
    const albumId = await this._service.addAlbum(data)

    const response = h.response({
      status: 'success',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)

    const response = h.response({
      status: 'success',
      data: album
    })
    return response
  }

  async editAlbumHandler (request, h) {
    const data = this._validator.validate(request.payload)
    const { id } = request.params

    await this._service.editAlbumById(id, data)

    const response = h.response({
      status: 'success',
      message: 'Album updated'
    })
    return response
  }

  async deleteAlbumHandler (request, h) {
    const { id } = request.params

    await this._service.deleteAlbumById(id)

    const response = h.response({
      status: 'success',
      message: 'Album deleted'
    })
    return response
  }
};

export default AlbumHandler
