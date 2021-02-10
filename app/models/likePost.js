const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')
const UserPost = require('../models/userPost')

// const LikePost = sequelize.define('Like_Post', {
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     unique: false
//   },
//   is_liked: {
//     type: DataTypes.BOOLEAN
//   },
//   media_type: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   media_id: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// },
// {
//   freezeTableName: true,
//   underscored: true
// })

// // LikePost.removeAttribute('id')

// LikePost.belongsTo(User, {
//   sourceKey: 'id',
//   foreignKey: 'user_id',
//   onDelete: 'Cascade',
//   onUpdate: 'Cascade'
// })

const LikePost = sequelize.define('Like_Post', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'user_post_unique'
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'user_post_unique'
  }
},
{
  freezeTableName: true,
  underscored: true
})

LikePost.removeAttribute('id')

LikePost.belongsTo(User, {
  sourceKey: 'id',
  as: 'likePost_user',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

LikePost.belongsTo(UserPost, {
  sourceKey: 'id',
  as: 'likePost_userPost',
  foreignKey: 'post_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

// LikePost.sync({ alter: true })

module.exports = LikePost
