const schema = require('../middleware/schemaValidator/userRefSchema')
const util = require('../utils/utils')
const CommonService = require('../services/commonService')
const commonService = new CommonService()
const UserPreference = require('../models/userPreference')
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
}
module.exports = ProfileController
