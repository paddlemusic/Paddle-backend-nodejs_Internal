const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')
const UserSongArtist = sequelize.define('User_SongArtist', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  track_ids: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  artist_ids: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  image_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  freezeTableName: true,
  underscored: true
})

UserSongArtist.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})
UserSongArtist.removeAttribute('id')

module.exports = UserSongArtist
