const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')
const UserShare = sequelize.define('User_Share', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  track_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  artist_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shared_with: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  freezeTableName: true,
  underscored: true
})

UserShare.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})
UserShare.removeAttribute('id')

module.exports = UserShare
