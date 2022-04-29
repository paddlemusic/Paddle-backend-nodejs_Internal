const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')

const UserPlaylist = sequelize.define('User_Playlist', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  freezeTableName: true,
  underscored: true
})

UserPlaylist.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

// UserPlaylist.sync({ force: true })

module.exports = UserPlaylist
