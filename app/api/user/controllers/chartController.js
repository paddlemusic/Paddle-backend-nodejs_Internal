const util = require('../../../utils/utils')
const config = require('../../../config/index')
const moment = require('moment')
const schema = require('../schemaValidator/chartSchema')

// const User = require('../../../models/user')
const University = require('../../../models/university')

const CommonService = require('../services/commonService')
const ChartService = require('../services/chartService')

const commonService = new CommonService()
const chartService = new ChartService()

class ChartController {
  async addMedia (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.addMedia.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      //console.log(validationResult)
      //return
      const date = moment().utc().format('YYYY-MM-DD')
      // const university = await commonService.findOne(User, { id: req.decoded.id }, ['university_code'])
      let universityCode = 0
      // if (university && university.university_code) {
      //   universityCode = university.university_code
      // }

      if (req.decoded.university_code) {
        const university = await commonService.findOne(University, { id: req.decoded.university_code }, ['is_active'])
        if (university && university.is_active) {
          universityCode = req.decoded.university_code
        }
      }
      const param = []
      if (validationResult.track) {
        validationResult.track.university_id = universityCode
        validationResult.track.date = date
        param.push(validationResult.track)
      }
      if (validationResult.artist) {
        validationResult.artist.university_id = universityCode
        validationResult.artist.date = date
        param.push(validationResult.artist)
      }
      if (validationResult.album) {
        validationResult.album.university_id = universityCode
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
      // const university = await commonService.findOne(User, { id: req.decoded.id }, ['university_code'])
      const university = await commonService.findOne(University, { id: req.decoded.university_code }, ['id', 'is_active'])
      console.log(university)
      if (university && university.is_active) {
        const result = await chartService.fetchChart(university.id, chartType, pagination)
        util.successResponse(res, config.constants.SUCCESS, langMsg.success, result)
      } else {
        util.failureResponse(res, config.constants.FORBIDDEN, langMsg.notAllowed)
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = ChartController
