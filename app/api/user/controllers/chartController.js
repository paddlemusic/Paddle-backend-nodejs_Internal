const util = require('../../../utils/utils')
const CommonService = require('../services/commonService')
const commonService = new CommonService()
const ChartService = require('../services/chartService')
const chartService = new ChartService()
const config = require('../../../config/index')
const schema = require('../schemaValidator/chartSchema')
const User = require('../../../models/user')
const moment = require('moment')

class ChartController {
  async addMedia (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.addMedia.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const date = moment().utc().format('YYYY-MM-DD')
      const university = await commonService.findOne(User, { id: req.decoded.id }, ['university_code'])

      const param = []
      if (validationResult.track) {
        validationResult.track.university_id = university?.university_code || null
        validationResult.track.date = date
        param.push(validationResult.track)
      }
      if (validationResult.artist) {
        validationResult.artist.university_id = university?.university_code || null
        validationResult.artist.date = date
        param.push(validationResult.artist)
      }
      if (validationResult.album) {
        validationResult.album.university_id = university?.university_code || null
        validationResult.album.date = date
        param.push(validationResult.album)
      }
      await chartService.submitStramingStats(param)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async fetchChart (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const chartType = Number(req.params.type)
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const university = await commonService.findOne(User, { id: req.decoded.id }, ['university_code'])
      if (university) {
        const result = await chartService.fetchChart(university.university_code, chartType, pagination)
        util.successResponse(res, config.constants.SUCCESS, langMsg.success, result)
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = ChartController
