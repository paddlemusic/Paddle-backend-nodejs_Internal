const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')
const UserPost = sequelize.define('User_Post', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
    // primaryKey: true
  },
  media_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  media_image: {
    type: DataTypes.STRING,
    allowNull: true // required
  },
  media_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meta_data: {
    type: DataTypes.STRING,
    allowNull: true
  },
  media_type: {
    type: DataTypes.INTEGER,
    allowNull: false // required
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shared_with: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
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
