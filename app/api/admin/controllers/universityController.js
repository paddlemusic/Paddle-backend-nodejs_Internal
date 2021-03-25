const CommonService = require('../services/commonService')
const UniversityService = require('../services/universityService')

const util = require('../../../utils/utils')
const config = require('../../../config/index')
const University = require('../../../models/university')
const UniversitySchema = require('../schemaValidator/universitySchema')
const Sequelize = require('sequelize')

const commonService = new CommonService()
const universityService = new UniversityService()

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
      const errorMessage = err.name === 'CustomError' ? err.message : langMsg.internalServerError
      const errorCode = err.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
      util.failureResponse(res, errorCode, errorMessage)
      // util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getUniversity (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const uniName = req.query.name
      const data = await universityService.getUniversities(uniName, pagination)
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

      const userList = await universityService.searchUniversity(userName, pagination)
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

  async editUniversity (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await UniversitySchema.editUniversity.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }

      const updatedResult = await commonService.update(University, req.body, { id: req.params.id })
      console.log('updated result', updatedResult)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async toggleUniversityStatus (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await UniversitySchema.deleteUniversity.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const param = { is_active: Sequelize.literal('NOT is_active') }
      const condition = { id: req.params.id }
      const data = await commonService.update(University, param, condition, true)
      console.log(data)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, data[1][0])
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getUniversityDetail (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await UniversitySchema.viewUniversity.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      // console.log(req.params.id)
      const myProfile = await commonService.findOne(University, { id: req.params.id }, ['name', 'city', 'created_at'])
      util.successResponse(res, config.constants.SUCCESS, langMsg.successResponse, myProfile)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}

module.exports = UniversityController
