const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')

const savedArtist = sequelize.define('savedArtist', {
    artist_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement:true
    },
    image_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  },
  {
    freezeTableName: true,
    underscored: true
  })
  module.exports = savedArtist