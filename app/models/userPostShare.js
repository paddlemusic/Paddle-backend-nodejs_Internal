const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const UserPost = require('../models/userPost')
const User = require('../models/user')

const PostShare = sequelize.define('Post_Share', {
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false
    // primaryKey: true
  },
  shared_by: {
    type: DataTypes.INTEGER,
    allowNull: false
    // primaryKey: true
  },
  shared_with: {
    type: DataTypes.INTEGER,
    allowNull: true
    // primaryKey: true
  }
},
{
  freezeTableName: true,
  underscored: true
})

PostShare.removeAttribute('id')

PostShare.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'shared_by',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

PostShare.belongsTo(UserPost, {
  sourceKey: 'id',
  foreignKey: 'post_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

PostShare.sync({ force: true })

module.exports = PostShare
