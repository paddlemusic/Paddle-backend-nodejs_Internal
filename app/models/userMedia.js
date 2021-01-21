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
    allowNull: false, // required,
    unique: 'user_id_media_id_media_type'
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
    allowNull: false, // required
    unique: 'user_id_media_id_media_type'
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
// UserMedia.sync()
module.exports = UserMedia
