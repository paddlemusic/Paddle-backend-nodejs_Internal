const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')
const UserPreference = sequelize.define('User_Preference', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  track_ids: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  artist_ids: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  }
},
{
  freezeTableName: true,
  underscored: true
})

UserPreference.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})
UserPreference.removeAttribute('id')

module.exports = UserPreference
