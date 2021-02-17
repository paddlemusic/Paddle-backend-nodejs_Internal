const User = require('../../../models/user')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class UserService {
  login (params) {
    return new Promise((resolve, reject) => {
      const userAttribute = ['id', 'name', 'username', 'email', 'phone_number',
        'password', 'is_privacy', 'is_verified', 'is_active', 'createdAt', 'updatedAt']
      const criteria = {
        role: 2,
        email: (params.email).toLowerCase()
      }
      User.findOne({ where: criteria, attributes: userAttribute })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getUsers (name, pagination) {
    return new Promise((resolve, reject) => {
      User.findAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: {
          name: {
            [Op.iLike]: '%' + name + '%'
          }
        },
        //        order: [
        //         ['created_at', 'DESC']
        //       ],
        attributes: ['id', 'name', 'profile_picture'],
        raw: true
        // result.likes=likes
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  forgotPassword (params) {
    return new Promise((resolve, reject) => {
      const criteria = {
        role: 2,
        email: params.email
      }
      User.findOne({ where: criteria })
        .then(result => resolve(result))
        .catch(err => reject(err))
      // console.log("result params from util services")
    })
  }

  updateResetPasswordToken (params) {
    return new Promise((resolve, reject) => {
      User.update({ resetPasswordToken: params.resetPasswordToken, resetPasswordExpires: Date.now() + 3600000 },
        { where: { id: params.id } })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  resetPassword (params) {
    return new Promise((resolve, reject) => {
      User.update({ password: params.newPassword, resetPasswordToken: null, resetPasswordExpires: null },
        { where: { resetPasswordToken: params.getResetPasswordToken, resetPasswordExpires: { [Op.gt]: Date.now() } } })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getVerificationToken (params) {
    return new Promise((resolve, reject) => {
      User.findOne({ where: { email: params.email }, raw: true, attributes: ['verification_token'] })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getResetPasswordToken (params) {
    return new Promise((resolve, reject) => {
      const userAttribute = ['reset_password_token', 'reset_password_expires']
      User.findOne({ where: { email: params.email }, raw: true, attributes: userAttribute })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
module.exports = UserService
