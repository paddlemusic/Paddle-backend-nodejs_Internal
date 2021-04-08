const CommonService = require('../services/commonService')
const UniversityService = require('../services/universityService')

const util = require('../../../utils/utils')
const config = require('../../../config/index')
const University = require('../../../models/university')
const UniversityDomain = require('../../../models/universityDomain')
const UniversitySchema = require('../schemaValidator/universitySchema')
const Sequelize = require('sequelize')

const commonService = new CommonService()
const universityService = new UniversityService()

class UniversityController {
  async addUniversity (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      // console.log('validationResultaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      const validationResult = await UniversitySchema.addUniversity.validateAsync(req.body)
      console.log('validationResult',validationResult)
      if (validationResult.error) {
        console.log('validationResult.error', validationResult)
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      const data = await commonService.create(University, { name: req.body.name, city: req.body.city })
      console.log(data)
      validationResult.domain.forEach(element => {
        console.log("domain",element)
      })
      const Params = []

      validationResult.domain.forEach(domain => {
          Params.push({
            university_id: data.dataValues.id,
            domain: domain
          })
      })
      const domainData = await commonService.bulkCreate(UniversityDomain, Params)
      console.log("domaindata",domainData)
      
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log('err is', err)
      console.log(err)
      if (err.name === 'ValidationError') {
        util.failureResponse(res, config.constants.BAD_REQUEST, err.details[0].message)
      } else if (err.name === 'CustomError') {
        util.failureResponse(res, config.constants.BAD_REQUEST, err.message)
      } else {
        util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
      }
      // const errorMessage = err.name === 'ValidationError' ? err.details[0].message : langMsg.internalServerError
      // const errorCode = err.name === 'ValidationError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
      // util.failureResponse(res, errorCode, errorMessage)
      // util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getUniversity (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const uniName = req.query.name
      let dataCount =0
     const data = await universityService.getUniversities(uniName, pagination)
      console.log("data",data)
      data.rows.forEach(element => {
        dataCount=dataCount+1
      })
      console.log("data count is",dataCount)
      for(let k=0;k<dataCount;k++)
      {
        data.rows[k].domains=new Array()
       }
     
      const domainData= await universityService.getDomainData()
      for(let i=0;i<dataCount;i++)
      {
        for(let j=0;j<domainData.count;j++)
        {
         if(Number(data.rows[i].id) === Number(domainData.rows[j].university_id))
          {
            data.rows[i].domains.push(domainData.rows[j].domain)
          }
        }
      }
      //console.log("data",data)
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
      const domainData = await commonService.delete(UniversityDomain, { university_id: req.params.id })
      console.log(domainData)
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
      console.log("validationResult",validationResult)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }

      const updatedResult = await commonService.update(University, req.body, { id: req.params.id })
      console.log('updated result', updatedResult)
      const data = await commonService.delete(UniversityDomain, { university_id: req.params.id })
      const Params = []

      validationResult.domain.forEach(domain => {
          Params.push({
            university_id: req.params.id,
            domain: domain
          })
      })
      const domainData = await commonService.bulkCreate(UniversityDomain, Params)
      console.log("domaindata",domainData)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      if (err.name === 'ValidationError') {
        util.failureResponse(res, config.constants.BAD_REQUEST, err.details[0].message)
      } else if (err.name === 'SequelizeUniqueConstraintError') {
        util.failureResponse(res, config.constants.BAD_REQUEST, err.message)
      } else {
        util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
      }
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
      console.log(myProfile)
      myProfile.domains=[]
      console.log(myProfile)
      const domainData = await commonService.findAll(UniversityDomain, { university_id: req.params.id },['domain'])
      console.log(domainData)
      const domainNames = domainData.map(data => { return data.domain })
      domainNames.forEach(domain => {
        myProfile.domains.push(domain)
    })
      util.successResponse(res, config.constants.SUCCESS, langMsg.successResponse, myProfile)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}

module.exports = UniversityController
