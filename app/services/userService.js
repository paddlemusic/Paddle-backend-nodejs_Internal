const User = require('../models/user')
const UserFollower = require('../models/userFollower')
const UserPost = require('../models/userPost')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')

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
          } else {
            console.log(err)
            reject(err)
          }
        })
    })
  }

  updateVerificationToken (params) {
    return new Promise((resolve, reject) => {
      User.is_verified = false
      User.update({ verification_token: params.otp },
        { where: { id: params.id } })
        .then(result => resolve(result))
        .catch(err => reject(err))
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

  verifyUser (params) {
    return new Promise((resolve, reject) => {
      const query = {}
      query.is_verified = true
      query.verification_token = null
      User.update(query, { where: { email: params.email } })
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

  forgotPassword (params) {
    return new Promise((resolve, reject) => {
      const criteria = {
        role: 1,
        email: params.email
      }
      User.findOne({ where: criteria })
        .then(result => resolve(result))
        .catch(err => reject(err))
      // console.log("result params from util services")
    })
  }
  /*  saveArtist (params) {
    return new Promise((resolve, reject) => {
      console.log('params are:', params)
      SaveArtist.create(params) */

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

  getUserFollowing (params) {
    const userId = params.id
    return new Promise((resolve, reject) => {
      UserFollower.findAll({
        where: { follower_id: userId },
        attributes: ['user_id'],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getFollowBack (id, followers) {
    return new Promise((resolve, reject) => {
      UserFollower.findAll({
        where: { user_id: followers, follower_id: id },
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

  // where (User_Post.user_id = following_ids) and (User_Post.shared_with = null OR User_Post.shared_with = user_id)

  getUserPost (followingId, userId, pagination) {
    console.log('ffffffffffff', followingId, userId)
    return new Promise((resolve, reject) => {
      UserPost.findAndCountAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: {
          [Op.and]: { user_id: followingId },
          [Op.or]: [
            { shared_with: userId },
            { shared_with: null }
          ],
          updated_at: {
            [Op.gte]: moment().subtract(5, 'days').toDate()
          }
        },
        order: [
          ['created_at', 'DESC']
        ],
        //,
        attributes: [Sequelize.literal(`"User_Post"."id","user_id","name","profile_picture","media_id","caption","shared_with",
        "media_image","media_name","meta_data","media_id","caption"`)],
        raw: true,
        include: [{
          model: User,
          required: true,
          attributes: []
          // as: 'post'
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getMyRecentPosts (userId, pagination) {
    return new Promise((resolve, reject) => {
      UserPost.findAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: { user_id: userId },
        order: [
          ['created_at', 'DESC']
        ],
        attributes: ['media_id', 'caption', 'shared_with', 'created_at'],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getUserSharedAsFriendPost (follwersId, sharedWith) {
    // console.log('ffffffffffff', follwersId, sharedWith)
    return new Promise((resolve, reject) => {
      UserPost.findAll({
        where: { user_id: follwersId, shared_with: sharedWith },
        attributes: [Sequelize.literal(`"User_Post"."id","user_id","name","profile_picture","media_id","caption","shared_with",
        "media_image","media_name","meta_data","media_id","caption"`)],
        raw: true,
        include: [{
          model: User,
          required: true,
          attributes: []
          // as: 'post'
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  updateTableUsingCron (table) {
    return new Promise((resolve, reject) => {
      table.update(
        { is_active: false },
        {
          where: {
            is_active: true,
            updated_at: {
              [Op.lte]: moment().subtract(5, 'days').toDate()
            }
          }
        }

      ).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getUsers (username) {
    return new Promise((resolve, reject) => {
      User.findAll({
        where: {
          name: {
            [Op.ilike]: username
          }
        },
        attributes: ['user_id', 'name', 'profile_picture'],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}

module.exports = UserService
