const DataTypes = require('sequelize').DataTypes
const sequelize = require('./index')
const User = require('./user')

const UserFollower = sequelize.define('User_Follower', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  }
},
{
  freezeTableName: true,
  underscored: true
})

UserFollower.belongsTo(User, {
  sourceKey: 'id',
  as: 'followed',
  foreignKey: 'user_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})

UserFollower.belongsTo(User, {
  sourceKey: 'id',
  as: 'follower',
  foreignKey: 'follower_id',
  onDelete: 'Cascade',
  onUpdate: 'Cascade'
})
UserFollower.removeAttribute('id')
module.exports = UserFollower

// UserFollower.sync({ force: true })
