
const authenticate = require('../middleware/authenticate');
//const {authSchema} = require('../middleware/userSchema');
const UserService = require('../services/userService')
//const util = require('../utils/utils');
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
//const config = require('../config')
const CommonService = require('../services/commonService')
const util = require('../utils/utils')
const config = require('../config/index')
const schema = require('../middleware/schemaValidator/userSchema')
const userService = new UserService()
const commonService = new CommonService()

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
      console.log("ye dekho ",otp)
      if (otp) {
        const otpJwt = await util.getJwtFromOtp(otp.otp)
        await userService.updateVerificationToken({ otp: otpJwt, id: signupData.dataValues.id })
      }
      const payload = {
        id: signupData.dataValues.id,
        username: signupData.dataValues.username,
        role: 1,
        isActive: signupData.dataValues.is_active
      }
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
            username: loginResponse.dataValues.username,
            role: 1,
            isActive: loginResponse.dataValues.is_active
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
  async saveArtist(req,res){
    const langMsg = config.messages[req.app.get('lang')]
    schema.saveArtist.validateAsync(req.body).then(async()=>{
      console.log("saveartist api called")
      const saveArtist = await userService.saveArtist(req.body)
      if(!saveArtist)
      {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      console.log("save artist details controller side",saveArtist)
    })
  }
  async forgotPassword(req,res){
//    console.log(req.body)
    const langMsg = config.messages[req.app.get('lang')]
    schema.forgotPassword.validateAsync(req.body).then(async()=>{
      const userExist = await userService.forgotPassword(req.body)
      //console.log("result params from controller services",userExist)
      if (!userExist) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      const getEmail=await util.sendEmail(userExist.dataValues.email,userExist.dataValues.name)
      if(getEmail)
      {
        const otpJwt = await util.getJwtFromOtp(getEmail.otp)
        await userService.updateVerificationToken({ otp: otpJwt, id: userExist.dataValues.id })
      }
      const payload = { id: userExist.dataValues.id, username: userExist.dataValues.username, role: 1 }
      const token = await util.generateJwtToken(payload)
      userExist.dataValues.token = token
      delete userExist.dataValues.password
      delete userExist.dataValues.role
      delete userExist.dataValues.device_token
      delete userExist.dataValues.verification_token
      delete userExist.dataValues.social_user_id
      delete userExist.dataValues.is_verified
      util.successResponse(res, config.constants.SUCCESS, langMsg.otpSent, userExist.dataValues)
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      const errorMessage = err.name === 'CustomError' ? err.message : langMsg.internalServerError
      const errorCode = err.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
      util.failureResponse(res, errorCode, errorMessage)
    })
  }
  async resetPassword(req,res){
    const langMsg = config.messages[req.app.get('lang')]
    schema.resetPassword.validateAsync(req.body).then(async()=>{
      const passwordHash = await util.encryptPassword(req.body.password)
      //console.log(passwordHash)
      req.body.password = passwordHash
      //console.log(req.body)
      const userExist = await userService.forgotPassword(req.body)
      //console.log("result params from controller services",userExist)
      if (!userExist) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      const resetPasswordToken = await util.generatePasswordReset()
      await userService.updateResetPasswordToken({ resetPasswordToken: resetPasswordToken, id: userExist.dataValues.id })
      const getResetPasswordToken = await userService.getResetPasswordToken(req.body)
      console.log("resetpasswordtakendetails",getResetPasswordToken)
      const resetPassword=await userService.resetPassword({getResetPasswordToken:getResetPasswordToken.reset_password_token,getResetPasswordExpires:getResetPasswordToken.reset_password_expires,newPassword:req.body.password})
      if(!resetPassword)
      {
        util.failureResponse(res, config.constants.UNAUTHORIZED, langMsg.notFound)
      }
      userExist.dataValues.token = resetPasswordToken
      delete userExist.dataValues.password
      delete userExist.dataValues.role
      delete userExist.dataValues.device_token
      delete userExist.dataValues.verification_token
      delete userExist.dataValues.social_user_id
      delete userExist.dataValues.is_verified
      util.successResponse(res, config.constants.SUCCESS, langMsg.passwordUpdated, userExist.dataValues)
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      const errorMessage = err.name === 'CustomError' ? err.message : langMsg.internalServerError
      const errorCode = err.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
      util.failureResponse(res, errorCode, errorMessage)
    })
  }
  async resendOtp(req,res){
    const langMsg = config.messages[req.app.get('lang')]
    schema.sendOTP.validateAsync(req.body).then(async () => {
      const userExist = await userService.forgotPassword(req.body)
      //console.log("result params from controller services",userExist)
      if (!userExist) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      const getEmail=await util.sendEmail(userExist.dataValues.email,userExist.dataValues.name)
      if(getEmail)
      {
        const otpJwt = await util.getJwtFromOtp(getEmail.otp)
        await userService.updateVerificationToken({ otp: otpJwt, id: userExist.dataValues.id })
      }
      const payload = { id: userExist.dataValues.id, username: userExist.dataValues.username, role: 1 }
      const token = await util.generateJwtToken(payload)
      userExist.dataValues.token = token
      delete userExist.dataValues.password
      delete userExist.dataValues.role
      delete userExist.dataValues.device_token
      delete userExist.dataValues.verification_token
      delete userExist.dataValues.social_user_id
      delete userExist.dataValues.is_verified
      util.successResponse(res, config.constants.SUCCESS, langMsg.otpSent, userExist.dataValues)
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      const errorMessage = err.name === 'CustomError' ? err.message : langMsg.internalServerError
      const errorCode = err.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
      util.failureResponse(res, errorCode, errorMessage)
    })
  }

  async socialMediaSignup (req, res) {
    console.log('IN controller')
    try {
      const langMsg = config.messages[req.app.get('lang')]
      if (req.user) {
        console.log('User is:', req.user)
        const token = authenticate.getToken({ _id: req.user.id })
        const userData = {
          name: req.user.displayName,
          username: req.user.id,
          social_user_id: req.user.id,
          email: req.user.emails[0].value || req.user.email,
          role: '1'
        }
        const isUserExist = await userService.isUserAlreadyExist({ social_user_id: userData.social_user_id })
        console.log('isUserExist:', isUserExist)
        console.log('msg:', config.messages.en.loginSuccess)
        if (isUserExist) {
          util.successResponse(res, config.constants.SUCCESS,
            langMsg.loginSuccess, { token: token })
        } else {
          try {
            const data = await userService.socialMediaSignup(userData)
            if (data) {
              util.successResponse(res, config.constants.SUCCESS,
                langMsg.loginSuccess, { token: token })
            }
          } catch (err) {
            console.log('Error1 is:', err)
            throw err
          }
          // else {
          //   util.failureResponse(res, langMsg.internalServerError, config.constants.internalServerError)
          // }
        }
      }
    } catch (err) {
      console.log('Error is:', err)
      throw err
    }
  }

  async editDetails (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.editDetails.validateAsync(req.body).then(async () => {
      const currentPhoneNumber = await commonService.findOne('User', { id: req.decoded.id }, ['phone_number'])
      const updateResult = await commonService.update('User', req.body, { id: req.decoded.id })
      console.log(currentPhoneNumber)
      console.log(JSON.stringify(updateResult))
      if (req.body.phone_number !== currentPhoneNumber.phone_number) {
        const otp = await util.sendOTP(req.body.phone_number)
        if (otp) {
          const otpJwt = await util.getJwtFromOtp(otp.otp)
          await commonService.update('User', { verification_token: otpJwt }, { id: req.decoded.id })
        }
        await commonService.update('User', { is_verified: false }, { id: req.decoded.id })
        util.successResponse(res, config.constants.ACCEPTED, langMsg.updateSuccess, {})
        return
      }
      util.successResponse(res, config.constants.SUCCESS, langMsg.updateSuccess, {})
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      const errorMessage = err.name === 'CustomError' ? err.message : langMsg.internalServerError
      const errorCode = err.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
      util.failureResponse(res, errorCode, errorMessage)
    })
  }

  async changePassword (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.changePassowrd.validateAsync(req.body).then(async () => {
      const data = await commonService.findOne('User', { id: req.decoded.id }, ['password'])
      console.log('OLd pwd is:', data.old_password)
      const isPasswordMatched = await util.comparePassword(req.body.old_password, data.password)
      if (isPasswordMatched) {
        const passwordHash = await util.encryptPassword(req.body.new_password)
        const updateResult = await commonService.update('User', { password: passwordHash }, { id: req.decoded.id })
        // console.log('updateResult:', updateResult)
        if (updateResult) { util.successResponse(res, config.constants.SUCCESS, langMsg.changePassowrd, {}) }
      } else {
        util.failureResponse(res, config.constants.BAD_REQUEST, langMsg.incorrectPassword)
      }
    }).catch(err => {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    })
  }
}
module.exports = UserController
