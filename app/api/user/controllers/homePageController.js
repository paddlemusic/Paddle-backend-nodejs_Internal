const util = require('../../../utils/utils')
const config = require('../../../config/index')
const schema = require('../schemaValidator/homeSchema')

const UserPost = require('../../../models/userPost')
const LikePost = require('../../../models/likePost')
// const UserMedia = require('../../../models/userMedia')
const notificationService = require('../services/notificationService')
const User = require('../../../models/user')
const PostShare = require('../../../models/userPostShare')

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
      const params = {
        user_id: req.decoded.id,
        media_id: validationResult.media_id,
        play_uri: validationResult.playURI,
        artist_id: validationResult.artist_id,
        album_id: validationResult.album_id,
        caption: validationResult.caption,
        media_image: validationResult.media_image,
        media_name: validationResult.media_name,
        meta_data: validationResult.meta_data,
        meta_data2: validationResult.meta_data2,
        media_type: req.params.media_type,
        album_name: validationResult.album_name
      }

      const createPostData = await commonService.create(UserPost, params)
      console.log(createPostData)

      const postShareParams = []

      validationResult.shared_with.forEach(shareId => {
        if (Number(req.decoded.id) !== Number(req.body.shareId)) {
          postShareParams.push({
            post_id: createPostData.id,
            shared_by: req.decoded.id,
            shared_with: shareId
          })
        }
      })
      const postShareData = await commonService.bulkCreate(PostShare, postShareParams, false)
      console.log(postShareData)

      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})

      // Notiification
      const user = await commonService.findOne(User, { id: req.decoded.id }, ['id', 'name'])

      let sharedWithUsersId
      if (validationResult.shared_with.length === 1 && validationResult.shared_with[0] === null) {
        const pagination = commonService.getPagination(null, null)
        const myfollowersData = await userService.getFollowers(req.decoded, pagination)
        console.log('myfollowersData', myfollowersData)

        sharedWithUsersId = myfollowersData.rows.map(data => { return { device_token: data.device_token } })
        console.log('sharedWithUsersId', sharedWithUsersId)
      } else {
        sharedWithUsersId = await commonService.findAll(User, { id: validationResult.shared_with }, ['device_token'])
      }

      const message = {
        notification: {
          title: 'New Post',
          body: `${user.name} shared a new Post.`
        },
        data: {
          post_id: `${createPostData.id}`,
          type: 'post'
        }
      }
      console.log(message)
      if (sharedWithUsersId.length) {
        await notificationService.sendNotification(sharedWithUsersId, message)
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async createUserPostOldMethod (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.userPost.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const param = {
        user_id: req.decoded.id,
        media_id: req.body.media_id,
        play_uri: req.body.playURI,
        artist_id: req.body.artist_id,
        album_id: req.body.album_id,
        caption: req.body.caption,
        media_image: req.body.media_image,
        media_name: req.body.media_name,
        meta_data: req.body.meta_data,
        meta_data2: req.body.meta_data2,
        media_type: req.params.media_type
      }
      const params = []

      validationResult.shared_with.forEach(shareId => {
        if (Number(req.decoded.id) !== Number(req.body.shareId)) {
          param.shared_with = shareId
          params.push(param)
        }
      })

      const createPostData = await commonService.bulkCreate(UserPost, params, false)
      console.log(createPostData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})

      // Notiification
      const user = await commonService.findOne(User, { id: req.decoded.id }, ['id', 'name'])

      let sharedWithUsersId
      if (validationResult.shared_with.length === 1 && validationResult.shared_with[0] === null) {
        const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
        const myfollowersData = await userService.getFollowers(req.decoded, pagination)
        console.log('myfollowersData', myfollowersData)

        sharedWithUsersId = myfollowersData.rows.map(data => { return { device_token: data.device_token } })
        console.log('sharedWithUsersId', sharedWithUsersId)
      } else {
        sharedWithUsersId = await commonService.findAll(User, { id: validationResult.shared_with }, ['device_token'])
      }

      const message = {
        notification: {
          title: 'New Post',
          body: `${user.name} shared a new Post.`
        },
        data: {

        }
      }
      console.log(message)
      await notificationService.sendNotification(sharedWithUsersId, message)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async deleteUserPosts (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const condition = { id: req.params.id, user_id: req.decoded.id }
      const deletePostData = await commonService.delete(UserPost, condition)
      console.log('post data is:', deletePostData)

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

  async getUserPostsOldMethod (req, res) {
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
        const data = await homeService.likePost(param)
        console.log('like', data)
      } else {
        const data = await homeService.unlikePost(param)
        console.log('unlike', data)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})

      // Notification
      if (req.params.type === 'like') {
        const user = await commonService.findOne(User, { id: req.decoded.id }, ['id', 'name'])

        const userId = await commonService.findOne(UserPost, { id: req.params.post_id }, ['user_id'])
        console.log(userId)
        const deviceTokens = await commonService.findOne(User, { id: userId.user_id }, ['device_token'])
        console.log(deviceTokens)
        const message = {
          notification: {
            title: 'New like!',
            body: `${user.name} liked your Post.`
          },
          data: {
            post_id: `${req.params.post_id}`,
            type: 'like'
          }
        }
        if (deviceTokens.device_token) {
          await notificationService.sendNotification([deviceTokens], message)
        }
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getAPost (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const postData = await homeService.getAPost(req.params.id)

      const likedByMePost = await commonService
        .findOne(LikePost, { user_id: req.decoded.id, post_id: req.params.id }, ['post_id'])

      console.log('likedByMePost', likedByMePost)
      console.log('post data is:', postData)

      postData.liked_by_me = likedByMePost !== null

      const response = {
        count: 1,
        rows: [postData]
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, response)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  // Redundant Method
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
      const createPostData = await commonService.create(UserPost, params)
      console.log(createPostData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})

      // Notification
      const user = await commonService.findOne(User, { id: req.decoded.id }, ['id', 'name'])
      const sharedWithUsersId = await commonService.findAll(User, { id: validationResult.shared_with }, ['device_token'])

      const message = {
        notification: {
          title: 'New Post',
          body: `${user.name} shared a new Post.`
        },
        data: {
          post_id: createPostData.id
        }
      }
      await notificationService.sendNotification(sharedWithUsersId, message)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = HomePageController
