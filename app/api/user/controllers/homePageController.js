const util = require('../../../utils/utils')
const config = require('../../../config/index')
const schema = require('../schemaValidator/homeSchema')

const UserPost = require('../../../models/userPost')
const LikePost = require('../../../models/likePost')
// const UserMedia = require('../../../models/userMedia')
// const notificationService = require('../services/notificationService')
// const User = require('../models/user')

const CommonService = require('../services/commonService')
const commonService = new CommonService()

const UserService = require('../services/userService')
const userService = new UserService()

const HomeService = require('../services/homeService')
const homeService = new HomeService()

class HomePageController {
  async createUserPost (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.userPost.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      if (Number(req.decoded.id) === Number(req.body.shared_with)) {
        util.failureResponse(res, config.constants.CONFLICT, langMsg.conflict)
        return
      }
      const params = {
        user_id: req.decoded.id,
        media_id: req.body.media_id,
        caption: req.body.caption,
        shared_with: req.body.shared_with,
        media_image: req.body.media_image,
        media_name: req.body.media_name,
        meta_data: req.body.meta_data,
        meta_data2: req.body.meta_data,
        media_type: req.params.media_type
      }

      console.log('params are:', params)
      await commonService.create(UserPost, params)
      // const followerName = await commonService.findOne(User, { id: req.decoded.id }, ['name'])
      // const payload = {
      //   message: {
      //     notification: {
      //       title: 'Paddle Notification ',
      //       body: followerName.dataValues.name + ' ' + ' shared a post with you'
      //     }
      //   }
      // }
      // if (req.body.shared_with === null) {
      //   const followingData = await userService.getFollowing(req.decoded)
      //   const followingToken = followingData.rows.map(follower => { return follower.device_token })
      //   await notificationService.sendNotification(followingToken, payload)
      // } else {
      //   const sharedwithToken = await commonService.findAll(User, { id: req.body.shared_with }, ['device_token'])
      //   await notificationService.sendNotification(sharedwithToken, payload)
      // }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getUserPosts (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)

      const myfollowingData = await userService.getUserFollowing(req.decoded)
      const myfollowingIDs = myfollowingData.map(data => { return data.user_id })
      console.log('myfollowingIDs is: ', myfollowingIDs)

      const postData = await homeService.getUserPost(myfollowingIDs, req.decoded.id, pagination)
      const postIds = postData.rows.map(post => { return post.id })
      console.log('postIds', postIds)

      const likedByMePosts = await commonService
        .findAll(LikePost, { user_id: req.decoded.id, post_id: postIds }, ['post_id'])
      console.log('likedByMePosts', likedByMePosts)

      postData.rows.forEach((post, index) => {
        postData.rows[index].liked_by_me = false
        likedByMePosts.forEach(likedPost => {
          if (post.id === likedPost.post_id) {
            postData.rows[index].liked_by_me = true
          }
        })
      })

      console.log('post data is:', postData)

      util.successResponse(res, config.constants.SUCCESS, langMsg.success, postData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async likeUnlikePost (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.likeUnlikePost.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const param = {
        user_id: req.decoded.id,
        post_id: req.params.post_id
      }
      if (req.params.type === 'like') {
        // const data = await commonService.findOrCreate(LikePost, param)
        const data = await homeService.likePost(param)
        console.log(data)
      } else {
        const data = await homeService.unlikePost(param)
        console.log(data)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async userShare (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.userPost.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      if (Number(req.decoded.id) === Number(req.body.shared_with)) {
        util.failureResponse(res, config.constants.CONFLICT, langMsg.conflict)
        return
      }
      const params = {
        user_id: req.decoded.id,
        media_id: req.body.media_id,
        caption: req.body.caption,
        shared_with: req.body.shared_with,
        media_image: req.body.media_image,
        media_name: req.body.media_name,
        meta_data: req.body.meta_data,
        media_type: req.params.media_type
      }
      console.log('params are:', params)
      await commonService.create(UserPost, params)
      // push notification section
      /*        const followerName = await commonService.findOne(User, { id: req.decoded.id }, ['name'])
        const payload = {
          message: {
            notification: {
              title: 'Paddle Notification ',
              body: followerName.dataValues.name + ' ' + ' shared a post with you'
            }
          }
        }
        if (req.body.shared_with === null) {
          const followingData = await userService.getFollowing(req.decoded)
          const followingToken = followingData.rows.map(follower => { return follower.device_token })
          await notificationService.sendNotification(followingToken, payload)
        } else {
          const sharedwithToken = await commonService.findAll(User, { id: req.body.shared_with }, ['device_token'])
          await notificationService.sendNotification(sharedwithToken, payload)
        } */
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = HomePageController
