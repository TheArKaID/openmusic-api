import { nanoid } from 'nanoid'
import pkg from 'pg'
import NotFoundError from '../exceptions/NotFoundError.js'
import InvariantError from '../exceptions/InvariantError.js'

const { Pool } = pkg

class AlbumService {
  constructor () {
    this._pool = new Pool()
  }

  async addAlbum (data) {
    const id = 'album-' + nanoid(16)
    const { name, year } = data
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = `INSERT INTO albums VALUES('${id}', '${name}', ${year}, '${createdAt}', '${updatedAt}') RETURNING id`

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Cannot add an Album')
    }
    return result.rows[0].id
  }

  async getAlbumById (id) {
    const queryAlbum = `SELECT id, name, year FROM albums WHERE id = '${id}'`

    const album = await this._pool.query(queryAlbum)

    if (!album.rows.length) {
      throw new NotFoundError('Album not found')
    }

    const querySong = `SELECT songs.id, songs.title, songs.performer FROM albums JOIN songs ON albums.id = songs.album_id WHERE albums.id = '${id}'`

    const songs = await this._pool.query(querySong)

    return {
      album: {
        ...album.rows[0],
        songs: songs.rows
      }
    }
  }

  async editAlbumById (id, data) {
    const { name, year } = data
    const updatedAt = new Date().toISOString()

    const query = `UPDATE albums SET name = '${name}', year = ${year}, updated_at = '${updatedAt}' WHERE id = '${id}' RETURNING id`

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Failed. Album Id not found')
    }

    return true
  }

  async deleteAlbumById (id) {
    const query = `DELETE FROM albums WHERE id = '${id}' RETURNING id`
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Albun Id not found')
    }

    return true
  }
};

export default AlbumService
