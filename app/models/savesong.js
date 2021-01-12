const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const Saveartist = require('../models/saveSong')
const savedSongs = sequelize.define('savedSongs', {
    track_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement:true
    },
    artist_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
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

  module.exports = savedSongs