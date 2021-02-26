const CommonService = require('../services/commonService')
const ProfileService = require('../services/profileService')

const util = require('../../../utils/utils')
const config = require('../../../config/index')
const University = require('../../../models/university')
const UniversitySchema = require('../schemaValidator/universitySchema')

const commonService = new CommonService()
const profileService = new ProfileService()

class UniversityController {
  async addUniversity (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await UniversitySchema.addUniversity.validateAsync(req.body)
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

  async getUniversity (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const data = await profileService.getUniversities(pagination)
      console.log(data)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async universitySearch (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const userName = req.query.name

      const userList = await profileService.searchUniversity(userName, pagination)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, userList)
    } catch (err) {
      console.log('err is:', err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async deleteUniversity (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await UniversitySchema.deleteUniversity.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const data = await commonService.delete(University, { id: req.params.id })
      console.log(data)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  /* async getUniversityDetail (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.viewUserProfile.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      // console.log(req.params.id)
      const myProfile = await commonService.findOne(University, { id: req.params.id }, ['name', 'username', 'email', 'phone_number', 'date_of_birth'])
      util.successResponse(res, config.constants.SUCCESS, langMsg.successResponse, myProfile)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  } */
}

module.exports = UniversityController
