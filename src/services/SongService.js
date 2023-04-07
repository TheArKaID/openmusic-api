import { nanoid } from 'nanoid'
import pkg from 'pg'
import NotFoundError from '../exceptions/NotFoundError.js'
import InvariantError from '../exceptions/InvariantError.js'

const { Pool } = pkg

class SongService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong (data) {
    const id = 'song-' + nanoid(16)
    const { title, year, performer, genre, duration, albumId } = data
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = `INSERT INTO songs VALUES('${id}', '${title}', ${year}, '${performer}', '${genre}', ${duration}, '${albumId}', '${createdAt}', '${updatedAt}') RETURNING id`

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Cannot add a Song')
    }

    return result.rows[0].id
  }

  async getSongs (data = {}) {
    const { title, performer } = data

    let cond = ''
    if (title && performer) {
      cond = ` WHERE title ILIKE '%${title}%' AND performer ILIKE '%${performer}%'`
    } else {
      if (title) {
        cond = ` WHERE title ILIKE '%${title}%'`
      }
      if (performer) {
        cond = ` WHERE performer ILIKE '%${performer}%'`
      }
    }
    const result = await this._pool.query('SELECT id, title, performer FROM songs' + cond)

    return result.rows
  }

  async getSongById (id) {
    const query = `SELECT id, title, year, performer, genre, duration, album_id FROM songs WHERE id = '${id}'`

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Song not found')
    }

    return result.rows[0]
  }

  async editSongById (id, data) {
    const { title, year, performer, genre, duration, albumId } = data
    const updatedAt = new Date().toISOString()

    const query = `UPDATE songs SET title = '${title}', year = ${year}, performer = '${performer}', genre = '${genre}', duration = ${duration}, album_id = '${albumId}', updated_at = '${updatedAt}' WHERE id = '${id}' RETURNING id`

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Song Id not found')
    }

    return true
  }

  async deleteSongById (id) {
    const query = `DELETE FROM songs WHERE id = '${id}' RETURNING id`

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Song Id not found')
    }

    return true
  }
};

export default SongService
