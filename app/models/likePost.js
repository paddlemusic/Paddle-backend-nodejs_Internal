const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')

const LikePost = sequelize.define('Like_Post', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false
  },
  is_liked: {
    type: DataTypes.BOOLEAN
  },
  media_type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  media_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
{
  freezeTableName: true,
  underscored: true
})

// UserState.removeAttribute('id')

LikePost.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

// LikePost.sync({ alter: true })

module.exports = LikePost
