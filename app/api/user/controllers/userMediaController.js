
const schema = require('../schemaValidator/userMediaSchema')
const util = require('../../../utils/utils')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const config = require('../../../config/index')

const CommonService = require('../services/commonService')
const commonService = new CommonService()
const UserService = require('../services/userService')
const userService = new UserService()
const UserPlaylist = require('../../../models/userPlaylist')
const PlaylistTrack = require('../../../models/playlistTrack')
const User = require('../../../models/user')
// const UserShare = require('../../../models/userPost')
const UserMedia = require('../../../models/userMedia')
const constants = require('../../../config/constants')
const UserMediaService = require('../services/userMediaService')
const userMediaService = new UserMediaService()

class UserMediaController {
/* Playlist Methods
      - Create Playlist
      - Update Playlist
      - Delete Playlist
      - Get Playlist
      - Add tracks to playlist
      - Remove tracks from playlist
      - Get playlist tracks
  */
  async createPlaylist (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.playlist.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      req.body.user_id = req.decoded.id
      const playlistData = await commonService.create(UserPlaylist, req.body)
      console.log(playlistData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async updatePlaylist (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.playlist.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const condition = { id: req.params.playlist_id, user_id: req.decoded.id }
      const playlistData = await commonService.update(UserPlaylist, req.body, condition)
      console.log(playlistData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async deletePlaylist (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.deletePlaylist.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const condition = { id: req.params.playlist_id, user_id: req.decoded.id }
      const playlistData = await commonService.delete(UserPlaylist, condition)
      console.log(playlistData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getPlaylist (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const condition = { user_id: req.decoded.id }
      const playlistData = await commonService.findAndCountAll(UserPlaylist, condition,
        ['id', 'name', 'description', 'image', 'createdAt', 'updatedAt'])
      console.log(playlistData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, playlistData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async addTracks (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.tracks.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      req.body.user_id = req.decoded.id
      const data = req.body.tracksData
      console.log(data)
      const params = data.map((item) => {
        return {
          playlist_id: req.params.playlist_id,
          media_id: item.media_id,
          play_uri: item.playURI, // added playURI in addtracks
          artist_id: item.artist_id, // added artist_id in addtracks
          album_id: item.album_id, // added album_id in addtracks
          media_image: item.media_image,
          media_name: item.media_name,
          meta_data: item.meta_data,
          meta_data2: item.meta_data,
          media_type: config.constants.MEDIA_TYPE.TRACK// 1 // req.params.media_type
        }
      })
      const playlistData = await commonService.bulkCreate(PlaylistTrack, params)
      console.log(playlistData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getPlaylistTracks (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const condition = { user_id: req.decoded.id, id: req.params.playlist_id }
      const playlistData = await commonService.findOne(UserPlaylist, condition,
        ['id', 'name', 'description', 'created_at', 'updated_at', 'image'])
      console.log(playlistData)
      const trackData = await commonService.findAndCountAll(PlaylistTrack, { playlist_id: playlistData.id },
        ['media_id', 'media_image', 'media_name', 'meta_data', 'meta_data2', 'media_type', 'created_at', 'updated_at', 'play_uri', 'artist_id', 'album_id']) // added playURI,artist_id,album_id in response
      console.log(trackData)
      trackData.playlist = playlistData
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, trackData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async deleteTracks (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.deleteTrack.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const condition = { media_id: req.body.track_ids }
      const playlistData = await commonService.delete(PlaylistTrack, condition)
      console.log(playlistData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  // Redundant API
  async getUserShareAsPost (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      // const validationResult = await schema.follow.validate(req.params)
      // if (validationResult.error) {
      //   util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      //   return
      // }
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const myfollowingData = await userService.getUserFollowing(req.decoded)
      const myfollowingIDs = myfollowingData.map(data => { return data.user_id })
      const postData = await userService.getUserPost(myfollowingIDs, req.decoded.id, pagination)
      console.log('MyFollower:', postData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, postData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  // Redundant API
  async getUserShareAsFriend (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.friend.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const myfollowingData = await userService.getUserFollowing(req.decoded)
      const myfollowingIDs = myfollowingData.map(data => { return data.user_id })
      const sharedWith = req.params.shared_with
      const postData = await userService.getUserSharedAsFriendPost(myfollowingIDs, sharedWith)
      console.log('MyFollower:', postData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, postData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  /** ************************************************************ */
  /* UserMedia Methods
      - Create UserMedia - covers Top Songs, Top Artsts, Saved Songs, Saved Artists
      - Delete UserMedia
  */
  async createUserMedia (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.userMedia.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      req.body.user_id = req.decoded.id
      const data = req.body.tracksData
      const params = data.map((item) => {
        return {
          user_id: req.decoded.id,
          media_id: item.media_id,
          play_uri: item.playURI, // added playURI in addsongs/artist
          artist_id: item.artist_id, // added artist_id in addsongs/artist
          album_id: item.album_id, // added album_id in addsongs/artist
          media_image: item.media_image,
          media_name: item.media_name,
          meta_data: item.meta_data,
          meta_data2: item.meta_data,
          media_type: req.params.media_type,
          usermedia_type: req.params.usermedia_type
        }
      })
      const mediaData = await commonService.bulkCreate(UserMedia, params)
      console.log('Data is:', mediaData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async orderUserMedia (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.userMedia.validateAsync(req.body)
      if (validationResult.error) {
        return util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      }
      req.body.user_id = req.decoded.id
      const data = req.body.tracksData
      const params = data.map((item) => {
        return {
          user_id: req.decoded.id,
          media_id: item.media_id,
          play_uri: item.playURI, // added playURI in addsongs/artist
          artist_id: item.artist_id, // added artist_id in addsongs/artist
          album_id: item.album_id, // added album_id in addsongs/artist
          media_image: item.media_image,
          media_name: item.media_name,
          meta_data: item.meta_data,
          meta_data2: item.meta_data,
          media_type: req.params.media_type,
          usermedia_type: req.params.usermedia_type,
          order: item.order
        }
      })
      const mediaData = await commonService.bulkUpdate(UserMedia, params, ['order'])
      console.log('Data is:', mediaData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async deleteUserMedia (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const userId = req.decoded.id
      const validationResult = await schema.deleteMedia.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const params = {
        user_id: userId,
        media_id: req.body.ids,
        media_type: req.params.media_type,
        usermedia_type: req.params.usermedia_type
      }
      const result = await commonService.delete(UserMedia, params)
      console.log(result)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log('err is:', err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getUserMedia (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const condition = {
        user_id: req.decoded.id,
        media_type: req.params.media_type,
        usermedia_type: req.params.usermedia_type
      }
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)

      if (Number(req.params.usermedia_type) === constants.USER_MEDIA_TYPE.TOP_TRACKS_ARTISTS) {
        const counts = await commonService
          .findOne(User, { id: req.decoded.id }, ['top_tracks_count', 'top_artist_count'])
        // condition.order = Number(req.params.media_type) === constants.MEDIA_TYPE.TRACK
        //   ? { [Op.lte]: counts.top_tracks_count }
        //   : { [Op.lte]: counts.top_artist_count }
        pagination.limit = Number(req.params.media_type) === constants.MEDIA_TYPE.TRACK
          ? counts.top_tracks_count
          : counts.top_artist_count
      }
      // added playURI in getsong/artistData response

      // const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const userMedia = await userMediaService.getUserMedia(condition, pagination)
      // await commonService.findAndCountAll(UserMedia, condition, pagination)
      console.log(userMedia)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, userMedia)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async updateTopMediaCount (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.topMediaCount.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST,
          validationResult.error.details[0].message)
        return
      }
      const params = {}
      if (validationResult.media_type === config.constants.MEDIA_TYPE.TRACK) {
        params.top_tracks_count = validationResult.count
      } else {
        params.top_artist_count = validationResult.count
      }
      commonService.update(User, params, { id: req.decoded.id }, false)

      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async trackArtistSearch (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const condition = {
        user_id: req.decoded.id,
        usermedia_type: req.params.usermedia_type,
        media_type: req.params.media_type,
        media_name: {
          [Op.iLike]: '%' + req.query.keyword + '%'
        }
      }
      // const attributes = ['user_id', 'media_id', 'media_name', 'media_image', 'meta_data', 'media_type', 'meta_data2']
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const userList = await commonService.findAndCountAll(UserMedia, condition, null, pagination)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, userList)
    } catch (err) {
      console.log('err is:', err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getRecentPosts (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)

      const myRecentPosts = await userService.getMyRecentPosts(req.decoded.id, pagination)

      util.successResponse(res, config.constants.SUCCESS, langMsg.success, myRecentPosts)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async isMediaSaved (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const condition = {
        user_id: req.decoded.id,
        media_id: req.params.media_id
      }
      console.log('condition isMediaSaved', condition)
      const isMediaSaved = await commonService.findOne(UserMedia, condition, ['media_id'])
      console.log('isMediaSaved', isMediaSaved)
      const response = {
        is_media_saved: isMediaSaved !== null
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, response)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getCoverImage (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const condition = {
        user_id: req.decoded.id,
        media_type: req.params.media_type,
        usermedia_type: constants.USER_MEDIA_TYPE.SAVED_TRACKS_ARTIST
      }
      const pagination = {
        limit: 4,
        offset: 0
      }
      const attributes = [Sequelize.fn('DISTINCT', Sequelize.col('media_image'))]
      const data = await commonService.findAll(UserMedia, condition, attributes, pagination)
      const coverImages = data.map(mediaImage => { return mediaImage.media_image })
      console.log('coverImages\n', coverImages)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, (coverImages.length < 4) ? [coverImages[0]] : coverImages)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}

module.exports = UserMediaController
