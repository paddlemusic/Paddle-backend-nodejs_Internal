const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')

const University = sequelize.define('University', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'name_city_un_key'
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: 'name_city_un_key'
  },
  // domain: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   defaultValue: 'mit.edu'
  // },
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

//University.sync({ alter: true })
