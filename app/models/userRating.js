const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('../models/user')

const UserRating = sequelize.define('User_Rating', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  rating: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feedback: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  freezeTableName: true,
  underscored: true
})

UserRating.removeAttribute('id')

UserRating.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

// UserRating.sync({ force: true })

module.exports = UserRating
