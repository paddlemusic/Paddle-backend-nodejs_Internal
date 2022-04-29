const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
// const University = require('./university')

const StreamStats = sequelize.define('Stream_Stats', {
  university_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    unique: 'stream_stats_un_key'
  },
  media_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'stream_stats_un_key'
  },
  media_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 3 },
    unique: 'stream_stats_un_key'
  },
  media_metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: 'stream_stats_un_key'
  },
  play_uri: {
    type: DataTypes.STRING,
    allowNull: true
  },
  artist_id: { // added key artist_id
    type: DataTypes.STRING,
    allowNull: true
  },
  album_id: { // added key album id
    type: DataTypes.STRING,
    allowNull: true
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 }
  },
  album_type: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
  freezeTableName: true,
  underscored: true,
  timestamps: false
})

/* StreamStats.belongsTo(University, {
  sourceKey: 'id',
  foreignKey: 'university_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
}) */

StreamStats.removeAttribute('id')

// StreamStats.sync({ alter: true })

module.exports = StreamStats
