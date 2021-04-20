const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')
// const LikePost = require('../models/likePost')
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
  play_uri: { // added playURI
    type: DataTypes.STRING,
    allowNull: true
  },
  artist_id: { // added key artist_id
    type: DataTypes.STRING,
    allowNull: true
  },
  album_id: { // added key album id
    type: DataTypes.STRING,
    allowNull: true
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
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // shared_with: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  like_count: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0
  },
  album_name: {
    type: DataTypes.TEXT,
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

// UserPost.hasOne(LikePost)

 UserPost.sync({ alter: false })

module.exports = UserPost
