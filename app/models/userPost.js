const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')
const UserPost = sequelize.define('User_Post', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
    // primaryKey: true

  },
  track_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shared_with: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  freezeTableName: true,
  underscored: true
})

UserPost.belongsTo(User, {
  sourceKey: 'id',
  // as: 'post',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})
// UserPost.sync({ alter: true })

module.exports = UserPost
