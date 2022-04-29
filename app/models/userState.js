const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')

const UserState = sequelize.define('User_State', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  isSpotifyConnected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
},
{
  freezeTableName: true,
  underscored: true
})

UserState.removeAttribute('id')

UserState.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

// UserState.sync({ force: true })

module.exports = UserState
