const schema = require('../schemaValidator/profileSchema')
const util = require('../../../utils/utils')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const config = require('../../../config/index')

const CommonService = require('../services/commonService')
const commonService = new CommonService()
// const notificationService = require('../services/notificationService')
const ProfileService = require('../services/profileService')
const profileService = new ProfileService()
const s3Bucket = require('../services/s3Bucket')
const User = require('../../../models/user')
const UserFollower = require('../../../models/userFollower')

class ProfileController {
  async userSearch (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const userName = req.query.name
      const condition = {
        name: {
          [Op.iLike]: '%' + userName + '%'
        }
      }
      const userList = await commonService.findAndCountAll(User, condition, ['id', 'name', 'profile_picture'])
      // console.log(JSON.stringify(userList, null, 2))
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, userList)
    } catch (err) {
      console.log('err is:', err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getProfile (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    let profileData
    try {
      const userId = req.params.userId
      let isFollowing = false
      const body = {
        user_id: userId // (5)
      }
      if (req.decoded.id /* 1 */ === Number(userId)) {
        profileData = await profileService.getProfile(body)
      } else {
        const condition = { user_id: userId, follower_id: req.decoded.id }
        const following = await commonService.findOne(UserFollower, condition)
        if (following) { isFollowing = true }
        const userDetail = await commonService.findOne(User, { id: body.user_id }, ['is_privacy'])
        if (!userDetail.is_privacy) {
          profileData = await profileService.getProfile(body)
        } else {
          const result = await commonService.findOne(UserFollower, { user_id: userId, follower_id: req.decoded.id }) // user (1) is following user(5) or not
          console.log('result is:', result)
          if (result) {
            profileData = await profileService.getProfile(body)
          } else {
            profileData = await profileService.getProfile(body)
            console.log('Profile data is:', profileData)
            delete profileData.topSong
            delete profileData.topArtist
            delete profileData.recentPost
          }
        }
      }
      profileData.isFollowing = isFollowing
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, profileData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async editDetails (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.editDetails.validateAsync(req.body).then(async () => {
      // const currentEmail = await commonService.findOne(User, { id: req.decoded.id }, ['email'])
      req.body.id = req.decoded.id
      const updateResult = await profileService.editDetails(req.body) // commonService.update(User, req.body, { id: req.decoded.id })
      // console.log(currentEmail)
      console.log(JSON.stringify(updateResult))
      // if (req.body.email !== currentEmail.email) {
      // const otp = await util.sendOTP(req.body.phone_number)
      //   const otp = await util.sendEmail(req.body.email, req.body.name)
      //   if (otp) {
      //     const otpJwt = await util.getJwtFromOtp(otp.otp)
      //     await commonService.update(User, { verification_token: otpJwt }, { id: req.decoded.id })
      //   }
      //   await commonService.update(User, { is_verified: false }, { id: req.decoded.id })
      //   util.successResponse(res, config.constants.ACCEPTED, langMsg.updateSuccess, {})
      //   return
      // }
      util.successResponse(res, config.constants.SUCCESS, langMsg.updateSuccess, {})
    }, reject => {
      console.log(reject)
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      const errorMessage = err.name === 'CustomError' ? err.message : langMsg.internalServerError
      const errorCode = err.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
      util.failureResponse(res, errorCode, errorMessage)
    })
  }

  async uploadFile (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      if (!req.file) {
        util.failureResponse(res, config.constants.BAD_REQUEST, langMsg.failed)
      }
      const myFile = req.file.originalname.split('.')
      const fileType = myFile[myFile.length - 1]
      const body = {
        fileType: fileType,
        buffer: req.file.buffer
      }
      const data = await s3Bucket.uploadToS3(body)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
    } catch (error) {
      console.log('Error is:', error)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getAccountDetails (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const attributes = ['id', 'name', 'username', 'email', 'phone_number', 'date_of_birth', 'profile_picture', 'biography']
      const profileData = await commonService.findOne(User, { id: req.decoded.id }, attributes)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, profileData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async checkUserPrivacy (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const userId = req.decoded.id
      const validationResult = await schema.userPrivacy.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      // const attributes = ['is_privacy']
      const isUserPrivacyOn = await commonService.update(User, { is_privacy: req.body.is_privacy }, { id: userId })
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, isUserPrivacyOn)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}

module.exports = ProfileController
