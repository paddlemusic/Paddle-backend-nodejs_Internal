const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const University = require('./university')

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
  biography: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_privacy: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: { isEmail: true }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  date_of_birth: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isURL: true }
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
    allowNull: true,
    validate: { min: 1, max: 2 }
  },
  device_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  university_code: {
    type: DataTypes.SMALLINT,
    allowNull: true,
    validate: { min: 1 }
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
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpires: {
    type: DataTypes.DATE
  },
  top_tracks_count: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 10,
    validate: { is: /^(0|3|5|10)/ }
  },
  top_artist_count: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 10,
    validate: { is: /^(0|3|5|10)/ }
  }
},
{
  freezeTableName: true,
  underscored: true
})

User.belongsTo(University, {
  sourceKey: 'id',
  foreignKey: 'university_code',
  onDelete: 'SET NULL',
  onUpdate: 'SET NULL'
})

module.exports = User

// User.sync({ alter: true })
