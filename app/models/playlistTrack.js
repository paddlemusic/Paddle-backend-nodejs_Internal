const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const UserPlaylist = require('../models/userPlaylist')

const PlaylistTrack = sequelize.define('Playlist_Track', {
  playlist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'unique_playlist_track_id'
  },
  track_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'unique_playlist_track_id'
  }
},
{
  freezeTableName: true,
  underscored: true
})

PlaylistTrack.removeAttribute('id')

PlaylistTrack.belongsTo(UserPlaylist, {
  sourceKey: 'id',
  foreignKey: 'playlist_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

// PlaylistTrack.sync()

module.exports = PlaylistTrack
