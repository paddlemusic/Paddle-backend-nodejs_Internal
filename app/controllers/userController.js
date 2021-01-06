
const authenticate = require('../middleware/authenticate');
const {authSchema} = require('../middleware/userSchema');
const UserService = require('../services/userService')
const util = require('../utils/utils');
const bcrypt = require("bcrypt");
//const config = require('../config/constants');
//import moment from 'moment';
//import uuidv4 from 'uuid/v4';
const Helper=require('./Helper');
//import Helper from './Helper';
const User = require('../models/user');
//const authenticate = require('../middleware/authenticate')
//const UserService = require('../services/userService')
//const util = require('../utils/utils')
const config = require('../config')
const schema = require('../middleware/schemaValidator/userSchema')
const userService = new UserService()

class UserController {
  async signup (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
   // console.log(langMsg);
    schema.signup.validateAsync(req.body).then(async () => {
      const passwordHash = await util.encryptPassword(req.body.password)
      req.body.password = passwordHash
      console.log(req.body);
      const signupData = await userService.signup(req.body)
      console.log("signupdatacalled",signupData);
      const otp = await util.sendOTP(signupData.dataValues.phone_number)
      if (otp) {
        const otpJwt = await util.getJwtFromOtp(otp.otp)
        await userService.updateVerificationToken({ otp: otpJwt, id: signupData.dataValues.id })
      }
      const payload = { id: signupData.dataValues.id, username: signupData.dataValues.username, role: 1 }
      const token = await util.generateJwtToken(payload)
      signupData.dataValues.token = token
      delete signupData.dataValues.password
      delete signupData.dataValues.role
      delete signupData.dataValues.device_token
      delete signupData.dataValues.verification_token
      delete signupData.dataValues.social_user_id
      util.successResponse(res, config.constants.SUCCESS, langMsg.signupSuccess, signupData.dataValues)
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      const errorMessage = err.name === 'CustomError' ? err.message : langMsg.internalServerError
      const errorCode = err.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
      util.failureResponse(res, errorCode, errorMessage)
    })
  }

  async verifyOTP (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.verifyOTP.validateAsync(req.body).then(async () => {
      const verificationToken = await userService.getVerificationToken(req.body)
      if (!verificationToken.verification_token) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
        return
      }
      const otp = await util.getOtpFromJwt(verificationToken.verification_token)
      if (otp.otp === req.body.otp) {
        await userService.verifyUser(req.body)
        util.successResponse(res, config.constants.SUCCESS, langMsg.userVerified, {})
      } else {
        util.failureResponse(res, config.constants.BAD_REQUEST, langMsg.otpIncorrect)
      }
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    })
  }

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
            username: loginResponse.dataValues.email,
            role: 1
          }
          const token = await util.generateJwtToken(payload)
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
  async forgotPassword(req,res){
//    console.log(req.body)
    const langMsg = config.messages[req.app.get('lang')]
    schema.forgotPassword.validateAsync(req.body).then(async()=>{
      const userExist = await userService.forgotPassword(req.body)
//      console.log("result params from controller services",userExist)
      if (!userExist) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      else
      {
        const resetPasswordToken = await util.generatePasswordReset()
//        console.log("result params from controller services resetPasswordToken",resetPasswordToken)
        await userService.updateResetPasswordToken({ resetPasswordToken: resetPasswordToken, id: userExist.dataValues.id })
        const getResetPasswordToken = await userService.getResetPasswordToken(req.body)
        if (!getResetPasswordToken) {
          util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
          return
        }
        console.log("result params from controller services getresetPasswordToken",getResetPasswordToken.reset_password_token)
      }
    })
  }

  async socialMediaSignup (req, res) {
    try {
      if (req.user) {
        // console.log("User is:", req.user);
        const token = authenticate.getToken({ _id: req.user.id })
        const userData = {
          name: req.user.displayName,
          username: req.user.id,
          social_user_id: req.user.id,
          email: req.user.emails[0].value,
          role: '1'
        }
        const isUserExist = await userService.isUserAlreadyExist({ social_user_id: userData.social_user_id })
        if (isUserExist) {
          util.successResponse(res, config.SUCCESS,
            config.LOGIN_SUCCESSFULLY, { token: token })
        } else {
          const data = await userService.socialMediaSignup(userData)
          if (data) {
            util.successResponse(res, config.SUCCESS,
              config.LOGIN_SUCCESSFULLY, { token: token })
          }
        }
      }
    } catch (err) {
      console.log('Error is:', err)
      throw err
    }
  }
}

module.exports = UserController
