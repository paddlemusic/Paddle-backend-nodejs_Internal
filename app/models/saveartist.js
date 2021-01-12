const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')

const SaveArtist = sequelize.define('SaveArtist', {
    artist_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement:true
    },
    artist_name: {
      type: DataTypes.STRING,
      allowNull: true
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
  module.exports = SaveArtist