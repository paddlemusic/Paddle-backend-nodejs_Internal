const CommonService = require('../services/commonService')
const commonService = new CommonService()
const SongService = require('../services/songService')
const songService = new SongService()
const util = require('../../../utils/utils')
const config = require('../../../config/index')
// const StreamStats = require('../../../models/streamStats')

class SongsController {
  async getSongs (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const uniName = req.query.name
      const data = await songService.getSongs(uniName, pagination)
      console.log(data)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = SongsController
