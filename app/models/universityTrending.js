const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const University = require('./university')
// const User = require('./user')

const UniversityTrending = sequelize.define('University_Trending', {
  university_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: 'university_id_media_id_media_type'
  },
  media_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'university_id_media_id_media_type'
  },
  media_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'university_id_media_id_media_type'
  },
  media_metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
},
{
  freezeTableName: true,
  underscored: true
})

UniversityTrending.belongsTo(University, {
  sourceKey: 'id',
  foreignKey: 'university_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

UniversityTrending.removeAttribute('id')

// UniversityTrending.sync({ alter: true })

module.exports = UniversityTrending
