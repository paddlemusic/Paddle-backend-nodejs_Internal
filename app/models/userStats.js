const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('./user')

const UserStats = sequelize.define('User_Stats', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'userId_date_unKey'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: 'userId_date_unKey'
  },
  university_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  app_usage_time: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  app_open_count: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  }
},
{
  freezeTableName: true,
  underscored: true,
  timestamps: false
})

UserStats.removeAttribute('id')

UserStats.belongsTo(User, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

// UserStats.sync()

module.exports = UserStats
