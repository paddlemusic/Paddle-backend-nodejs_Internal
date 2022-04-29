const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const University = require('./university')

const UniversityDomain = sequelize.define('University_Domain', {
  university_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'university_id_domain_unique_key'
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'university_id_domain_unique_key'
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

UniversityDomain.removeAttribute('id')

UniversityDomain.belongsTo(University, {
    sourceKey: 'id',
    foreignKey: 'university_id',
    onDelete: 'Cascade',
    onUpdate: 'Cascade'
  })

module.exports = UniversityDomain

//UniversityDomain.sync()
