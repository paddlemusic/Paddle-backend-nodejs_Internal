const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')

const University = sequelize.define('University', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
},
{
  freezeTableName: true,
  underscored: true
})

module.exports = University

// University.sync({ alter: true })
