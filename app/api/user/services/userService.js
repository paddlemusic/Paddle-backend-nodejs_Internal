const User = require('../../../models/user')
const UserFollower = require('../../../models/userFollower')
const UserPost = require('../../../models/userPost')
const LikeUnlike = require('../../../models/likePost')
// const LikePost = require('../models/likePost')
// const CommonService = require('../services/commonService')
// const commonService = new CommonService()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')
const sequelize = require('../../../models')
// const UserStats = require('../../../models/userStats')

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
      params.email = params.email.toLowerCase()
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
        'password', 'is_privacy', 'is_verified', 'is_active', 'is_blocked', 'createdAt', 'updatedAt']
      const criteria = {
        role: 1,
        email: (params.email).toLowerCase()
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
        .then(result => resolve(result.get({ plain: true })))
        .catch(err => {
          if (err.original.code === '23505' || err.original.code === 23505) {
            switch (err.errors[0].path) {
              case 'email':
                reject(new CustomError('Email address is already registered.'))
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

  isUserAlreadyExist (params) {
    return new Promise((resolve, reject) => {
      const userAttribute = ['name', 'username', 'email', 'phone_number', 'date_of_birth', 'social_user_id',
        'password', 'role', 'device_token', 'is_active', 'is_verified', 'verification_token', 'id', 'university_code']
      User.findOne({ where: params, raw: true }, { attribute: userAttribute })
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
      const userAttribute = ['id', 'name', 'username', 'phone_number', 'date_of_birth', 'biography', 'profile_picture']
      User.update(params, { where: { id: params.id }, returning: true, attributes: userAttribute })
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

  getFollowing (params) {
    return new Promise((resolve, reject) => {
      UserFollower.findAndCountAll({
        where: { follower_id: params.id },
        attributes: [Sequelize.literal('"followed"."id","followed"."name","followed"."profile_picture","followed"."device_token"')],
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
        attributes: [Sequelize.literal('"follower"."id","follower"."name","follower"."username","follower"."profile_picture"')],
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

  getLikes (params) {
    return new Promise((resolve, reject) => {
      LikeUnlike.findAndCountAll({
        where: { is_liked: true, media_type: params.media_type, media_id: params.media_id },
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

  getMyRecentPosts (userId, pagination, myMediaids, myMediaTypes) {
    return new Promise((resolve, reject) => {
      // const likes = commonService.findAndCountAll(LikeUnlike, { media_type: myMediaTypes, media_id: myMediaids, is_liked: true })
      UserPost.findAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: { user_id: userId },
        order: [
          ['created_at', 'DESC']
        ],
        attributes: ['id', 'media_id', 'caption', 'shared_with', 'media_name', 'media_image', 'meta_data', 'meta_data2', 'media_type', 'created_at', 'like_count'],
        raw: true
        // result.likes=likes
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

  isUsernameAvailable (username) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          where: {
            username: username
          },
          attributes: ['username']
        }
      ).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  // async submitUserStats (params, didOpenApp) {
  //   // return new Promise((resolve, reject) => {
  //   //   // params.app_open_count = sequelize.literal('app_open_count + 1')
  //   //   UserStats.findOrCreate({
  //   //     where: params
  //   //   })
  //   //     .then(result => resolve(result))
  //   //     .catch(err => reject(err))
  //   // })
  //   const findOrCreate = await UserStats.findOrCreate({ where: params })
  //   console.log(findOrCreate)
  //   if (didOpenApp) {
  //     // increment open_app_count
  //   }
  //   return findOrCreate
  // }

  async submitUserStats (params) {
    console.log(params)
    const updateQuery = params.did_open_app
      ? ', app_open_count = "User_Stats".app_open_count + 1;'
      : ';'
    const rawQuery =
             `INSERT INTO
                "User_Stats" (
                user_id,
                university_id,
                "date",
                app_usage_time,
                app_open_count)
              VALUES ( $1, $2, $3, $4, $5) 
              ON CONFLICT 
                (user_id,
                "date") 
              DO UPDATE
              SET
                app_usage_time = "User_Stats".app_usage_time + $4
                ${updateQuery}`
    const data = await sequelize.query(rawQuery, {
      bind: [params.user_id, params.university_id, params.date, params.app_usage_time, 1]
    })
    return data
  }
}

module.exports = UserService
