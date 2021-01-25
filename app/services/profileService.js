const User = require('../models/user')
const UserFollower = require('../models/userFollower')
const UserPost = require('../models/userPost')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')

class ProfileService {
  getProfile (params) {
    return new Promise((resolve, reject) => {
    //     User.is_verified = false
    //     User.update({ verification_token: params.otp },
    //       { where: { id: params.id } })
    //       .then(result => resolve(result))
    //       .catch(err => reject(err))
    })
  }
}

module.exports = ProfileService
