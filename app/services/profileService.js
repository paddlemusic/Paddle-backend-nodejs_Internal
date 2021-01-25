const User = require('../models/user')
const UserFollower = require('../models/userFollower')
const UserMedia = require('../models/userMedia')

const CommonService = require('../services/commonService')
const commonService = new CommonService()

const UserService = require('../services/userService')
const userService = new UserService()

class ProfileService {
  async getProfile (params) {
    console.log('Params is:', params)
    // return new Promise((resolve, reject) => {
    const userDetail = await commonService.findOne(User, { id: params.user_id }, ['name', 'id', 'profile_picture'])
    const follwerDetails = await UserFollower.findAndCountAll({
      where: { user_id: params.user_id },
      raw: true
    })
    const follwingDetails = await UserFollower.findAndCountAll({
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
      following: follwingDetails.count,
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
}

module.exports = ProfileService
