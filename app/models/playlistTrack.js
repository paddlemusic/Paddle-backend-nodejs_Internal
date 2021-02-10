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
  },
  media_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  media_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meta_data: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meta_data2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  media_type: {
    type: DataTypes.INTEGER,
    allowNull: true
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
