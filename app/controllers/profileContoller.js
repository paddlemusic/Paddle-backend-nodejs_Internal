const schema = require('../middleware/schemaValidator/userRefSchema')
const userSchema = require('../middleware/schemaValidator/userSchema')
const util = require('../utils/utils')
const CommonService = require('../services/commonService')
const commonService = new CommonService()
const UserPreference = require('../models/userPreference')
const UserSongArtist = require('../models/userSongArtist')
const UserPlaylist = require('../models/userPlaylist')
const PlaylistTrack = require('../models/playlistTrack')
const config = require('../config/index')

class ProfileController {
  async saveTrackArtist (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      if (req.params.type === '1') {
        const validationResult = await schema.track.validate(req.body)
        if (validationResult.error) {
          util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
          return
        }
        req.body.user_id = req.decoded.id
        const trackIds = req.body.ids
        const trackData = await commonService.upsert(UserPreference, { user_id: req.decoded.id, track_ids: trackIds }, { user_id: req.decoded.id })
        console.log('Data is:', trackData)
        util.successResponse(res, config.constants.SUCCESS, langMsg.trackAdded, {})
      } else if (req.params.type === '2') {
        const validationResult = await schema.artist.validate(req.body)
        if (validationResult.error) {
          util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
          return
        }
        req.body.user_id = req.decoded.id
        const artistIds = req.body.ids
        const artistData = await commonService.upsert(UserPreference, { user_id: req.decoded.id, artist_ids: artistIds }, { user_id: req.decoded.id })
        console.log('Data is:', artistData)
        util.successResponse(res, config.constants.SUCCESS, langMsg.artistAdded, {})
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async deleteTrackArtist (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const userId = req.decoded.id
      if (req.params.type === '1') {
        const validationResult = await schema.track.validate(req.body)
        if (validationResult.error) {
          util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
          return
        }
        const trackIds = req.body.ids
        const result = await commonService.findOne(UserPreference, { user_id: userId }, ['track_ids'])
        const arr = result.track_ids
        const mTrackArr = arr.filter(function (item) {
          return !trackIds.includes(item)
        })
        const updateRes = await commonService.update(UserPreference, { track_ids: mTrackArr }, { user_id: req.decoded.id })
        util.successResponse(res, config.constants.SUCCESS, langMsg.trackDeleted, {})

        console.log('REsult is:', updateRes)
      } else if (req.params.type === '2') {
        const validationResult = await schema.artist.validate(req.body)
        if (validationResult.error) {
          util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
          return
        }
        const artistIds = req.body.ids
        const result = await commonService.findOne(UserPreference, { user_id: userId }, ['artist_ids'])
        const arr = result.artist_ids
        console.log('Arr:', arr, artistIds)
        const mArtistArr = arr.filter(function (item) {
          return !artistIds.includes(item)
        })
        const updateRes = await commonService.update(UserPreference, { artist_ids: mArtistArr }, { user_id: req.decoded.id })
        console.log('REsult is:', updateRes)
        util.successResponse(res, config.constants.SUCCESS, langMsg.artistDeleted, {})
      }
    } catch (err) {
      console.log('err is:', err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async savedSongArtist (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      if (req.params.type === '1') {
        const validationResult = await schema.track.validate(req.body)
        if (validationResult.error) {
          util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
          return
        }
        req.body.user_id = req.decoded.id
        const trackIds = req.body.ids
        const trackData = await commonService.upsert(UserSongArtist, { user_id: req.decoded.id, track_ids: trackIds }, { user_id: req.decoded.id })
        console.log('Data is:', trackData)
        util.successResponse(res, config.constants.SUCCESS, langMsg.trackAdded, {})
      } else if (req.params.type === '2') {
        const validationResult = await schema.artist.validate(req.body)
        if (validationResult.error) {
          util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
          return
        }
        req.body.user_id = req.decoded.id
        const artistIds = req.body.ids
        const artistData = await commonService.upsert(UserSongArtist, { user_id: req.decoded.id, artist_ids: artistIds }, { user_id: req.decoded.id })
        console.log('Data is:', artistData)
        util.successResponse(res, config.constants.SUCCESS, langMsg.artistAdded, {})
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async deleteSongArtist (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const userId = req.decoded.id
      if (req.params.type === '1') {
        const validationResult = await schema.track.validate(req.body)
        if (validationResult.error) {
          util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
          return
        }
        const trackIds = req.body.ids
        const result = await commonService.findOne(UserSongArtist, { user_id: userId }, ['track_ids'])
        const arr = result.track_ids
        const mTrackArr = arr.filter(function (item) {
          return !trackIds.includes(item)
        })
        const updateRes = await commonService.update(UserSongArtist, { track_ids: mTrackArr }, { user_id: req.decoded.id })
        util.successResponse(res, config.constants.SUCCESS, langMsg.trackDeleted, {})

        console.log('REsult is:', updateRes)
      } else if (req.params.type === '2') {
        const validationResult = await schema.artist.validate(req.body)
        if (validationResult.error) {
          util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
          return
        }
        const artistIds = req.body.ids
        const result = await commonService.findOne(UserSongArtist, { user_id: userId }, ['artist_ids'])
        const arr = result.artist_ids
        console.log('Arr:', arr, artistIds)
        const mArtistArr = arr.filter(function (item) {
          return !artistIds.includes(item)
        })
        const updateRes = await commonService.update(UserSongArtist, { artist_ids: mArtistArr }, { user_id: req.decoded.id })
        console.log('REsult is:', updateRes)
        util.successResponse(res, config.constants.SUCCESS, langMsg.artistDeleted, {})
      }
    } catch (err) {
      console.log('err is:', err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  /* Playlist Methods
      - Create Playlist
      - Update Playlist
      - Delete Playlist
      - Add tracks to playlist
      - Remove tracks from playlist
  */
  async createPlaylist (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await userSchema.playlist.validateAsync(req.body)
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
      const validationResult = await userSchema.playlist.validateAsync(req.body)
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
      const validationResult = await userSchema.deletePlaylist.validateAsync(req.params)
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

  async addTracks (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await userSchema.tracks.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const params = []
      req.body.track_ids.forEach(trackId => {
        params.push({ playlist_id: req.params.playlist_id, track_id: trackId })
      })
      console.log(params)
      const playlistData = await commonService.bulkCreate(PlaylistTrack, params)
      console.log(playlistData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async deleteTracks (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await userSchema.tracks.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const condition = { track_id: req.body.track_ids }
      const playlistData = await commonService.delete(PlaylistTrack, condition)
      console.log(playlistData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = ProfileController
