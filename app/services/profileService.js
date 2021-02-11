const User = require('../models/user')
const UserFollower = require('../models/userFollower')
const UserMedia = require('../models/userMedia')
const LikePost = require('../models/likePost')
const UserPost = require('../models/userPost')
// const Sequelize = require('sequelize')
// const Op = Sequelize.Op

const CommonService = require('../services/commonService')
const commonService = new CommonService()

const UserService = require('../services/userService')
const userService = new UserService()

class ProfileService {
  async getProfile (params) {
    // let userDetail, topSongDetails, topArtistDetails, recentPostsDetails, pagination, follwerDetails, followingDetails
    // const userDetail = await commonService.findOne(User, { id: params.user_id }, ['name', 'id', 'profile_picture', 'is_privacy'])
    // console.log('Params is:', JSON.stringify(userDetail, null, 2))

    console.log('Params is:', params)
    // return new Promise((resolve, reject) => {
    const userDetail = await commonService.findOne(User, { id: params.user_id }, ['id', 'name', 'username', 'profile_picture', 'is_privacy'])
    const follwerDetails = await UserFollower.findAndCountAll({
      where: { user_id: params.user_id },
      raw: true
    })
    const followingDetails = await UserFollower.findAndCountAll({
      where: { follower_id: params.user_id },
      raw: true
    })
    const topSongDetails = await commonService.findOne(UserMedia, { user_id: params.user_id, media_type: 1 },
      ['media_id', 'media_name', 'media_image', 'meta_data'])

    const topArtistDetails = await commonService.findOne(UserMedia, { user_id: params.user_id, media_type: 2 },
      ['media_id', 'media_name', 'media_image', 'meta_data'])
    const pagination = commonService.getPagination(null, 0)
    const recentPostsDetails = await userService.getMyRecentPosts(params.user_id, pagination)

    const data = {
      userDetail,
      follower: follwerDetails.count,
      following: followingDetails.count,
      topSong: topSongDetails,
      topArtist: topArtistDetails,
      recentPost: recentPostsDetails
    }

    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        reject(new Error('Data is not coming'))
      }
    })
  }

  async likePost (params) {
    return new Promise((resolve, reject) => {
      LikePost.findOrCreate({ where: params })
        .then(_ => {
          return UserPost.findOne({ where: { id: params.post_id } })
            .then(findResult => { findResult.increment('like_count') })
        }).catch(err => reject(err))
    })
  }

  async unlikePost (params) {
    return new Promise((resolve, reject) => {
      LikePost.destroy({ where: params })
        .then(_ => {
          return UserPost.findOne({ where: { id: params.post_id } })
            .then(findResult => { findResult.decrement('like_count') })
        }).catch(err => reject(err))
    })
  }

  // getUsersByName (username) {
  //   console.log('username is:', username)
  //   return new Promise((resolve, reject) => {
  //     User.findAndCountAll({
  //       where: {
  //         name: {
  //           [Op.iLike]: '%' + username + '%'
  //         }
  //       },
  //       attributes: ['id', 'name', 'profile_picture'],
  //       raw: true
  //     }).then(result => resolve(result))
  //       .catch(err => reject(err))
  //   })
  // }
}

module.exports = ProfileService
