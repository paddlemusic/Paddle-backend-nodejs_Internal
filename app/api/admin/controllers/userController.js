const CommonService = require('../services/commonService')
const UserService = require('../services/userService')
const util = require('../../../utils/utils')
const config = require('../../../config/index')
const User = require('../../../models/user')
const schema = require('../schemaValidator/userSchema')

const commonService = new CommonService()
const userService = new UserService()

class UserController {
  async login (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.login.validateAsync(req.body).then(async () => {
      const loginResponse = await userService.login(req.body)
      if (!loginResponse) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      } else if (!loginResponse.dataValues.is_active) {
        util.failureResponse(res, config.constants.FORBIDDEN, langMsg.userDeactivated)
      } else if (!loginResponse.dataValues.password) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      } else {
        const didMatch = await util.comparePassword(req.body.password, loginResponse.dataValues.password)
        if (didMatch) {
          const payload = {
            id: loginResponse.dataValues.id,
            username: loginResponse.dataValues.username,
            role: 2,
            isActive: loginResponse.dataValues.is_active
          }
          const token = await util.generateJwtToken(payload)
          // console.log('token is', token)
          await commonService.update(User, { device_token: token }, { email: req.body.email.toLowerCase() })
          loginResponse.dataValues.token = token
          delete loginResponse.dataValues.password
          util.successResponse(res, config.constants.SUCCESS, langMsg.loginSuccess, loginResponse.dataValues)
        } else {
          util.failureResponse(res, config.constants.UNAUTHORIZED, langMsg.wrongPassword)
        }
      }
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      util.failureResponse(res, langMsg.internalServerError, config.constants.internalServerError)
    })
  }

  async logout (req, res) {
    console.log(req.decoded.id)
    const langMsg = config.messages[req.app.get('lang')]
    try {
      console.log(req.decoded.id)
      await commonService.update(User, { device_token: null }, { id: req.decoded.id })
      util.successResponse(res, config.constants.SUCCESS, langMsg.logOut, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getUserProfiles (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      console.log(req.decoded.id)
      const myProfile = await commonService.findOne(User, { id: req.decoded.id }, ['name', 'username', 'biography', 'phone_number', 'date_of_birth'])
      util.successResponse(res, config.constants.SUCCESS, langMsg.successResponse, myProfile)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async userSearch (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      // const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const userName = req.query.name

      const userList = await userService.getUsers(userName)
      console.log(userList)
      // const userList = await commonService.findAndCountAll(User, condition, ['id', 'name', 'profile_picture'])
      // console.log(JSON.stringify(userList, null, 2))
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, userList)
    } catch (err) {
      console.log('err is:', err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async blockUnblockUser (req, res) {
    console.log('caleed', req.body)
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.blockUnblockUser.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      if (req.params.type === 'block') {
        const data = await commonService.update(User, { is_blocked: true }, { id: req.body.ids, role: 1 })
        console.log(data)
      } else if (req.params.type === 'unblock') {
        const data = await commonService.update(User, { is_blocked: false }, { id: req.body.ids, role: 1 })
        console.log(data)
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}

module.exports = UserController
