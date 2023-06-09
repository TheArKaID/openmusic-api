/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'varchar(30)',
      primaryKey: true
    },
    user_id: {
      type: 'varchar(30)',
      references: '"users"',
      onDelete: 'cascade',
      unique: true
    },
    playlist_id: {
      type: 'varchar(30)',
      references: '"playlists"',
      onDelete: 'cascade',
      unique: true
    },
    created_at: {
      type: 'text',
      notNull: true
    },
    updated_at: {
      type: 'text',
      notNull: true
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('collaborations')
}
