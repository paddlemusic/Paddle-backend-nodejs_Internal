const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('./user')

const UserMedia = sequelize.define('User_Media', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // required,
    unique: 'user_id_media_id_media_type'
  },
  media_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'user_id_media_id_media_type'
  },
  play_uri: { // added playURI in user media
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
    allowNull: false,
    unique: 'user_id_media_id_media_type'
  },
  usermedia_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: 'user_id_media_id_media_type'
    // defaultValue: 1
  }
},
{
  freezeTableName: true,
  underscored: true
})

UserMedia.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

// UserMedia.removeAttribute('id')
// UserMedia.sync({ alter: true })
module.exports = UserMedia
