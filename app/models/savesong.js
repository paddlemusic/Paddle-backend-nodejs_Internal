const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')

const SaveSong = sequelize.define('SaveSong', {
    track_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement:true
    },
    song_name: {
      type: DataTypes.STRING,
      allowNull: true
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

  module.exports = SaveSong