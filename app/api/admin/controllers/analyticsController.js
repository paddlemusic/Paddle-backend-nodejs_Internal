const CommonService = require('../services/commonService')
const util = require('../../../utils/utils')
const config = require('../../../config/index')
const University = require('../../../models/university')
const AnalyticsSchema = require('../schemaValidator/analyticsSchema')

const commonService = new CommonService()

class AnalyticsController {
  async getStreams (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
        const validationResult = await AnalyticsSchema.getStream.validateAsync(req.query)
        if (validationResult.error) {
          util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
          return
        }
        const data = await commonService.create(University, { name: req.body.name, city: req.body.city })
        console.log(data)
        util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
      } catch (err) {
        console.log(err)
        util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
      }
    }
  }
}

module.exports = AnalyticsController
