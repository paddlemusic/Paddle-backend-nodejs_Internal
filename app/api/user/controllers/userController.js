// const authenticate = require('../middleware/authenticate')
const UserService = require('../services/userService')
const User = require('../../../models/user')
const CommonService = require('../services/commonService')
const notificationService = require('../services/notificationService')
const util = require('../../../utils/utils')
// const firebase = require('../utils/firebase')
const country = require('../../../utils/country')
const config = require('../../../config/index')
const schema = require('../schemaValidator/userSchema')
const userService = new UserService()
const commonService = new CommonService()
const UserFollower = require('../../../models/userFollower')
const University = require('../../../models/university')
const UniversityDomain = require('../../../models/universityDomain')
const UserRating = require('../../../models/userRating')
// const LikeUnlike = require('../../../models/likePost')
// const { token } = require('morgan')
// const utils = require('../utils/utils')
const moment = require('moment')
// const UserStats = require('../../../models/userStats')
const s3Bucket = require('../services/s3Bucket')

class UserController {
  async signup (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.signup.validateAsync(req.body).then(async () => {
      if (req.body.passcode) {
        // User has passcode, no need to verify university email address.
        if (req.body.passcode !== config.constants.PASSCODE) {
          return util.failureResponse(res, config.constants.FORBIDDEN, langMsg.invalidPasscode)
        }
      } else if (req.body.university_code) {
        // since user has not entered passcode, we need to verify its university email address.
        let isUniversityEmail = false
        const domains = await commonService
          .findAll(UniversityDomain, { university_id: req.body.university_code }, ['domain'])
        console.log(domains)

        const reqDomain = req.body.email.split('@').pop()
        console.log(reqDomain)

        domains.every(function (domain, _) {
          if (reqDomain.includes(domain.domain)) {
            isUniversityEmail = true
            return false
          }
          return true
        })

        if (!isUniversityEmail) {
          return util.failureResponse(res, config.constants.FORBIDDEN, langMsg.passcodeOremail)
        }
      } else {
        return util.failureResponse(res, config.constants.FORBIDDEN, langMsg.passcodeOremail)
      }
      const passwordHash = await util.encryptPassword(req.body.password)
      req.body.password = passwordHash

      const signupData = await userService.signup(req.body)

      const username = [signupData.dataValues.name.toLowerCase().replace(' ', '_'), signupData.dataValues.id].join('_')
      await commonService.update(User, { username: username }, { id: signupData.dataValues.id })

      const university = await commonService
        .findOne(University, { id: signupData.dataValues.university_code }, ['id', 'name', 'city', 'is_active'])

      const otp = await util
        .sendEmail(signupData.dataValues.email, signupData.dataValues.name, config.constants.OTPType.VERIFY_ACCOUNT)
      if (otp) {
        const payload = {
          otp: otp.otp,
          email: signupData.dataValues.email
        }
        const verificationToken = await util.generateVerificationToken(payload)
        await userService.updateVerificationToken({ otp: verificationToken, id: signupData.dataValues.id })
      }
      const payload = {
        id: signupData.dataValues.id,
        username: signupData.dataValues.username,
        universityId: signupData.dataValues.university_code,
        role: config.constants.ROLE.USER, // 1,
        isActive: signupData.dataValues.is_active,
        isVerified: signupData.dataValues.is_verified
      }
      const token = await util.generateJwtToken(payload)

      signupData.dataValues.token = token
      delete signupData.dataValues.password
      delete signupData.dataValues.role
      delete signupData.dataValues.device_token
      delete signupData.dataValues.verification_token
      delete signupData.dataValues.social_user_id
      delete signupData.dataValues.reset_password_token
      delete signupData.dataValues.reset_password_expires
      signupData.dataValues.university = university

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
      const token = await util.getOtpFromJwt(verificationToken.verification_token)
      if (token.otp === req.body.otp && token.email === req.body.email) {
        const payload = {
          email: token.email,
          isOTPVerified: true
        }
        const verificationToken = await util.generateVerificationToken(payload)// util.getJwtForResetPassword(payload)
        req.body.verification_token = verificationToken
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

  async changeEmailAddress (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.changeEmailAddress.validateAsync(req.body)
      if (validationResult.error) {
        return util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      }
      const verificationStatus = await commonService.findOne(User, { id: req.decoded.id }, ['is_verified', 'name'])
      if (verificationStatus.is_verified) {
        return util.failureResponse(res, config.constants.FORBIDDEN, langMsg.notAllowed)
      }
      await commonService.update(User, validationResult, { id: req.decoded.id })
      const sendEmail = await util
        .sendEmail(validationResult.email, verificationStatus.name, config.constants.OTPType.VERIFY_ACCOUNT)
      if (sendEmail) {
        // const otpJwt = await util.getJwtFromOtp(sendEmail.otp)
        const payload = {
          otp: sendEmail.otp,
          email: validationResult.email
        }
        const verificationToken = await util.generateVerificationToken(payload)
        await userService.updateVerificationToken({ otp: verificationToken, id: req.decoded.id })
      }
      util.successResponse(res, config.constants.SUCCESS,
        langMsg.success, {})
    } catch (error) {
      console.log(error)
      const errorMessage = error.name === 'CustomError' ? error.message : langMsg.internalServerError
      const errorCode = error.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
      util.failureResponse(res, errorCode, errorMessage)
    }
  }

  async login (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.login.validateAsync(req.body).then(async () => {
      const loginResponse = await userService.login(req.body)
      console.log('login response', loginResponse)
      if (!loginResponse) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      } else if (!loginResponse.dataValues.is_active) {
        util.failureResponse(res, config.constants.FORBIDDEN, langMsg.userDeactivated)
      } else if (!loginResponse.dataValues.password) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      } else {
        const didMatch = await util.comparePassword(req.body.password, loginResponse.dataValues.password)
        if (didMatch) {
          const university = await commonService
            .findOne(University, { id: loginResponse.dataValues.university_code }, ['id', 'name', 'city', 'is_active'])

          const payload = {
            id: loginResponse.dataValues.id,
            username: loginResponse.dataValues.username,
            universityId: loginResponse.dataValues.university_code,
            role: config.constants.ROLE.USER, // 1,
            isActive: loginResponse.dataValues.is_active,
            isVerified: loginResponse.dataValues.is_verified
          }

          const token = await util.generateJwtToken(payload)

          loginResponse.dataValues.token = token
          loginResponse.dataValues.university = university
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

  async forgotPassword (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.forgotPassword.validateAsync(req.body).then(async () => {
      const userExist = await userService.forgotPassword(req.body)
      if (!userExist) {
        return util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      const getEmail = await util
        .sendEmail(userExist.dataValues.email, userExist.dataValues.name, config.constants.OTPType.RESET_PASSWORD)
      if (getEmail) {
        // const otpJwt = await util.getJwtFromOtp(getEmail.otp)
        const payload = {
          otp: getEmail.otp,
          email: userExist.dataValues.email
        }
        const verificationToken = await util.generateVerificationToken(payload)
        await userService.updateVerificationToken({ otp: verificationToken, id: userExist.dataValues.id })
      }
      // await commonService.update(User, { is_verified: false }, { id: userExist.dataValues.id })

      // We do not need to send token in forget password response.

      // const payload = { id: userExist.dataValues.id, username: userExist.dataValues.username, role: 1 }
      // const token = await util.generateJwtToken(payload)
      // userExist.dataValues.token = token
      // delete userExist.dataValues.password
      // delete userExist.dataValues.role
      // delete userExist.dataValues.device_token
      // delete userExist.dataValues.verification_token
      // delete userExist.dataValues.social_user_id
      // util.successResponse(res, config.constants.SUCCESS, langMsg.otpSent, userExist.dataValues)
      util.successResponse(res, config.constants.SUCCESS, langMsg.otpSent, {})
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    })
  }

  async resetPassword (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.resetPassword.validateAsync(req.body).then(async () => {
      const passwordHash = await util.encryptPassword(req.body.password)
      req.body.password = passwordHash
      const userExist = await userService.forgotPassword(req.body)
      if (!userExist) {
        return util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      // const resetPasswordToken = await util.generatePasswordReset()
      // await userService.updateResetPasswordToken({ resetPasswordToken: resetPasswordToken, id: userExist.dataValues.id })
      // const getResetPasswordToken = await userService.getResetPasswordToken(req.body)
      // console.log('resetpasswordtakendetails', getResetPasswordToken)
      // const resetPassword = await userService.resetPassword({ getResetPasswordToken: getResetPasswordToken.reset_password_token, getResetPasswordExpires: getResetPasswordToken.reset_password_expires, newPassword: req.body.password })
      // if (!resetPassword) {
      //   util.failureResponse(res, config.constants.UNAUTHORIZED, langMsg.notFound)
      // }
      const verificationToken = await util.getOtpFromJwt(userExist.dataValues.verification_token)
      if (verificationToken.email === userExist.dataValues.email && verificationToken.isOTPVerified) {
        await commonService.update(User,
          { password: passwordHash, verification_token: null },
          { email: verificationToken.email })
        return util.successResponse(res, config.constants.SUCCESS, langMsg.passwordUpdated, {})
      } else {
        return util.failureResponse(res, config.constants.BAD_REQUEST, langMsg.tokenExpired)
      }

      // userExist.dataValues.token = resetPasswordToken
      // delete userExist.dataValues.password
      // delete userExist.dataValues.role
      // delete userExist.dataValues.device_token
      // delete userExist.dataValues.verification_token
      // delete userExist.dataValues.social_user_id
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    })
  }

  async resendOtp (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.sendOTP.validateAsync(req.body).then(async () => {
      const userExist = await userService.forgotPassword(req.body)
      if (!userExist) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      const getEmail = await util.sendEmail(userExist.dataValues.email, userExist.dataValues.name, config.constants.OTPType.VERIFY_ACCOUNT)
      if (getEmail) {
        // const otpJwt = await util.getJwtFromOtp(getEmail.otp)
        const payload = {
          otp: getEmail.otp,
          email: userExist.dataValues.email
        }
        const verificationToken = await util.generateVerificationToken(payload)
        await userService.updateVerificationToken({ otp: verificationToken, id: userExist.dataValues.id })
      }
      // const payload = { id: userExist.dataValues.id, username: userExist.dataValues.username, role: 1 }
      // const token = await util.generateJwtToken(payload)
      // userExist.dataValues.token = token
      // delete userExist.dataValues.password
      // delete userExist.dataValues.role
      // delete userExist.dataValues.device_token
      // delete userExist.dataValues.verification_token
      // delete userExist.dataValues.social_user_id
      util.successResponse(res, config.constants.SUCCESS, langMsg.otpSent, {})
    }, reject => {
      util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
    }).catch(err => {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    })
  }

  async socialMediaSignup (req, res) {
    console.log('IN controller')
    let socialData, userExistData
    const langMsg = config.messages[req.app.get('lang')]
    try {
      if (req.user) {
        console.log('User is:', req.user)

        // const token = authenticate.getToken({ _id: req.user.id })
        const userData = {
          name: req.user.displayName,
          username: req.user.id,
          social_user_id: req.user.id,
          email: req.user.emails[0].value || req.user.email,
          role: config.constants.ROLE.USER
        }
        userExistData = await userService.isUserAlreadyExist({ social_user_id: userData.social_user_id })
        console.log('isUserExist:', userExistData)
        console.log('msg:', config.messages.en.loginSuccess)
        if (userExistData) {
          const data = {
            // id: userExistData.id,
            // email: req.user.emails[0].value || req.user.email,
            // role: '1',
            // isActive: true
            id: userExistData.id,
            username: userExistData.username,
            universityId: userExistData.university_code,
            role: config.constants.ROLE.USER,
            isActive: userExistData.is_active,
            isVerified: userExistData.is_verified
          }
          const token = await util.generateJwtToken(data)
          userExistData.token = token
          // console.log('userExistData:', userExistData)
          util.successResponse(res, config.constants.SUCCESS,
            langMsg.loginSuccess, userExistData)
        } else {
          try {
            socialData = await userService.socialMediaSignup(userData)
            // console.log('socialData:', socialData)
            if (socialData) {
              const username = [socialData.name.replace(' ', '_'), socialData.id].join('_')
              await commonService.update(User, { username: username }, { id: socialData.id })
              const data = {
                // id: socialData.id,
                // email: req.user.emails[0].value || req.user.email,
                // role: '1',
                // isActive: true
                id: socialData.id,
                username: socialData.username,
                universityId: socialData.university_code,
                role: config.constants.ROLE.USER,
                isActive: socialData.is_active,
                isVerified: socialData.is_verified
              }
              const token = await util.generateJwtToken(data)
              socialData.token = token
              util.successResponse(res, config.constants.SUCCESS,
                langMsg.loginSuccess, socialData)
            }
          } catch (err) {
            const errorMessage = err.name === 'CustomError' ? err.message : langMsg.internalServerError
            const errorCode = err.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
            util.failureResponse(res, errorCode, errorMessage)
          }
        }
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
      // console.log('Error is:', err)
      // throw err
    }
  }

  async changePassword (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.changePassowrd.validateAsync(req.body).then(async () => {
      const data = await commonService.findOne(User, { id: req.decoded.id }, ['password'])
      console.log('OLd pwd is:', data.old_password)
      const isPasswordMatched = await util.comparePassword(req.body.old_password, data.password)
      if (isPasswordMatched) {
        const passwordHash = await util.encryptPassword(req.body.new_password)
        const updateResult = await commonService.update(User, { password: passwordHash }, { id: req.decoded.id })
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

  async getUniversity (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const condition = { is_active: true }
      const attributes = ['id', 'name', 'city', 'created_at', 'updated_at']
      const data = await commonService.findAll(University, condition, attributes)
      console.log(data)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getCountryCallingCode (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const data = await country.getCachedCountryCallingCode()
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
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
      const upload = await s3Bucket.uploadToS3(body)
      // await commonService.update(User, { profile_picture: upload.Location }, { id: req.decoded.id })
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, { Location: upload.Location })
    } catch (error) {
      console.log('Error is:', error)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async updateDeviceToken (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.updateDeviceToken.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      await commonService.update(User, { device_token: validationResult.device_token }, { id: req.decoded.id })

      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async logout (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      await commonService.update(User, { device_token: null }, { id: req.decoded.id })
      util.successResponse(res, config.constants.SUCCESS, langMsg.logOut, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async follow (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.follow.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      if (Number(req.decoded.id) === Number(req.params.user_id)) {
        util.failureResponse(res, config.constants.CONFLICT, langMsg.conflict)
        return
      }
      const params = { user_id: req.params.user_id, follower_id: req.decoded.id }
      const idAlreadyFollowing = await commonService.findOne(UserFollower, params, ['user_id', 'follower_id'])
      if (idAlreadyFollowing) {
        util.failureResponse(res, config.constants.CONFLICT, langMsg.conflict)
        return
      }
      await commonService.create(UserFollower, params)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})

      // Notification
      const followerData = await commonService.findOne(User, { id: req.decoded.id }, ['id', 'name'])
      console.log(followerData)
      const followedData = await commonService.findOne(User, { id: req.params.user_id }, ['device_token'])
      console.log(followedData)

      const message = {
        notification: {
          title: 'You got a new follower!!',
          body: `${followerData.name} started following you.`
        },
        data: {
          user_id: `${followerData.id}`,
          type: 'follow'
        }
      }
      if (followedData.device_token) {
        await notificationService.sendNotification([followedData], message)
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async unfollow (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.follow.validateAsync(req.params)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      if (req.decoded.id === req.params.user_id) {
        util.failureResponse(res, config.constants.CONFLICT, langMsg.conflict)
        return
      }
      const params = { user_id: req.params.user_id, follower_id: req.decoded.id }
      await commonService.delete(UserFollower, params)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getFollowing (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const followingData = await userService.getFollowing(req.decoded, pagination)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, followingData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getFollowers (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      const followerData = await userService.getFollowers(req.decoded, pagination)
      const followersID = followerData.rows.map(follower => { return follower.id })
      const followBackData = await userService.getFollowBack(req.decoded.id, followersID)
      followerData.rows.forEach((follower, index) => {
        followBackData.forEach(followBack => {
          followerData.rows[index].follow_back = follower.id === followBack.id
        })
      })
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, followerData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async searchFollowers (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const pagination = commonService.getPagination(req.query.page, req.query.pageSize)
      req.decoded.keyword = req.query.keyword
      const followerData = await userService.searchFollowers(req.decoded, pagination)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, followerData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async isUsernameAvailable (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const data = await userService.isUsernameAvailable(req.query.username)
      console.log(data)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, { is_available: data === null })
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async rateApp (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.rateApp.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      validationResult.user_id = req.decoded.id
      const data = await commonService.createOrUpdate(UserRating, validationResult)
      console.log(data)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, { })
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getRateApp (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const data = await commonService.findOne(UserRating, { user_id: req.decoded.id })
      console.log(data)
      delete data.user_id
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, data)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async submitStats (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.submitStats.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      console.log(validationResult)

      // const university = await commonService.findOne(User, { id: req.decoded.id }, ['university_code'])
      validationResult.user_id = req.decoded.id
      validationResult.university_id = req.decoded.university_code || null// university.university_code
      validationResult.date = moment().utc().format('YYYY-MM-DD')

      const response = await userService.submitUserStats(validationResult)
      console.log(response)

      util.successResponse(res, config.constants.SUCCESS, langMsg.success, { })
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = UserController
