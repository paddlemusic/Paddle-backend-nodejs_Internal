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
    type: DataTypes.JSON,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: 'stream_stats_un_key'
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 }
  }
},
{
  freezeTableName: true,
  underscored: true,
  timestamps: false
})

// StreamStats.belongsTo(University, {
//   sourceKey: 'id',
//   foreignKey: 'university_id',
//   onDelete: 'Cascade',
//   onUpdate: 'Cascade'
// })

StreamStats.removeAttribute('id')

// StreamStats.sync({ force: true })

module.exports = StreamStats
