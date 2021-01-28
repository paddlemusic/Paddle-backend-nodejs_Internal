const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const University = require('./university')

const UniversityTrending = sequelize.define('University_Trending', {
  university_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'university_id_media_id_media_type'
  },
  media_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'university_id_media_id_media_type'
  },
  media_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  media_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meta_data: {
    type: DataTypes.STRING,
    allowNull: true
  },
  media_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'university_id_media_id_media_type'
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false
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

// UniversityTrending.sync()

module.exports = UniversityTrending
