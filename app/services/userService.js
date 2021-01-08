const User = require('../models/user')
const UserFollower = require('../models/userFollower')
const Sequelize = require('sequelize')

class CustomError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CustomError'
  }
}

class UserService {
  signup (params) {
    return new Promise((resolve, reject) => {
      params.role = 1 // 1->User, 2->Admin
      console.log(params)
      User.create(params)
        .then(result => resolve(result))
        .catch(err => {
          if (err.original.code === '23505' || err.original.code === 23505) {
            switch (err.errors[0].path) {
              case 'phone_number':
                reject(new CustomError('Phone number is already registered.'))
                break
              case 'email':
                reject(new CustomError('Email address is already registered.'))
                break
              case 'username':
                reject(new CustomError('Username is already registered.'))
                break
              default:
                reject(err)
            }
          }
        })
    })
  }

  updateVerificationToken (params) {
    return new Promise((resolve, reject) => {
      User.update({ verification_token: params.otp },
        { where: { id: params.id } })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getVerificationToken (params) {
    return new Promise((resolve, reject) => {
      User.findOne({ where: { phone_number: params.phone_number }, raw: true, attributes: ['verification_token'] })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  verifyUser (params) {
    return new Promise((resolve, reject) => {
      const query = {}
      query.is_verified = true
      query.verification_token = null
      User.update(query, { where: { phone_number: params.phone_number } })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  login (params) {
    return new Promise((resolve, reject) => {
      const userAttribute = ['id', 'name', 'username', 'email', 'phone_number',
        'password', 'is_verified', 'is_active', 'createdAt', 'updatedAt']
      const criteria = {
        role: 1,
        email: params.email
      }
      User.findOne({ where: criteria, attributes: userAttribute })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  socialMediaSignup (params) {
    return new Promise((resolve, reject) => {
      console.log('params are:', params)
      User.create(params)
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  isUserAlreadyExist (params) {
    return new Promise((resolve, reject) => {
      const userAttribute = ['name', 'username', 'email', 'phophone_number', 'date_of_birth', 'social_user_id',
        'password', 'role', 'device_token', 'is_active', 'is_verified', 'verification_token']
      User.findOne({ where: params }, { attribute: userAttribute })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  editDetails (params) {
    return new Promise((resolve, reject) => {
      console.log(params)
      const userAttribute = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'role', 'is_verified']
      User.update(params, { where: { id: params.id }, returning: true, attributes: userAttribute })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getFollowing (params) {
    return new Promise((resolve, reject) => {
      UserFollower.findAndCountAll({
        where: { follower_id: params.id },
        attributes: [Sequelize.literal('"followed"."id","followed"."name","followed"."profile_picture"')],
        raw: true,
        include: [{
          model: User,
          required: true,
          attributes: [],
          as: 'followed'
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getFollowers (params) {
    return new Promise((resolve, reject) => {
      UserFollower.findAndCountAll({
        where: { user_id: params.id },
        attributes: [Sequelize.literal('"follower"."id","follower"."name","follower"."profile_picture"')],
        raw: true,
        include: [{
          model: User,
          required: true,
          attributes: [],
          as: 'follower'
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}

module.exports = UserService
