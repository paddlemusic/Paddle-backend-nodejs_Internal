const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  social_user_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  device_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  verification_token: {
    type: DataTypes.STRING
  },
  resetPasswordToken:{
    type:DataTypes.STRING
  },
  resetPasswordExpires:{
    type:DataTypes.DATE
  }
},
{
  freezeTableName: true,
  underscored: true
})

module.exports = User
