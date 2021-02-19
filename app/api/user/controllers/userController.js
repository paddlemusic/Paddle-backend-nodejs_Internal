// const authenticate = require('../middleware/authenticate')
const UserService = require('../services/userService')
const User = require('../../../models/user')
const CommonService = require('../services/commonService')
// const notificationService = require('../services/notificationService')
const util = require('../../../utils/utils')
// const firebase = require('../utils/firebase')
const country = require('../../../utils/country')
const config = require('../../../config/index')
const schema = require('../schemaValidator/userSchema')
const userService = new UserService()
const commonService = new CommonService()
const UserFollower = require('../../../models/userFollower')
const University = require('../../../models/university')
const UserRating = require('../../../models/userRating')
// const LikeUnlike = require('../../../models/likePost')
// const { token } = require('morgan')
// const utils = require('../utils/utils')
// const moment = require('moment')
// const UserStats = require('../../../models/userStats')

class UserController {
  async signup (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.signup.validateAsync(req.body).then(async () => {
      const passwordHash = await util.encryptPassword(req.body.password)
      req.body.password = passwordHash
      const signupData = await userService.signup(req.body)
      //  const otp = await util.sendOTP(signupData.dataValues.phone_number)
      const username = [signupData.dataValues.name.replace(' ', '_'), signupData.dataValues.id].join('_')
      await commonService.update(User, { username: username }, { id: signupData.dataValues.id })
      const otp = await util.sendEmail(signupData.dataValues.email, signupData.dataValues.name)
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
      delete signupData.dataValues.reset_password_token
      delete signupData.dataValues.reset_password_expires
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
          const payload = {
            id: loginResponse.dataValues.id,
            username: loginResponse.dataValues.username,
            role: 1,
            isActive: loginResponse.dataValues.is_active
          }
          const token = await util.generateJwtToken(payload)
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

  async forgotPassword (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.forgotPassword.validateAsync(req.body).then(async () => {
      const userExist = await userService.forgotPassword(req.body)
      if (!userExist) {
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      const getEmail = await util.sendEmail(userExist.dataValues.email, userExist.dataValues.name)
      if (getEmail) {
        const otpJwt = await util.getJwtFromOtp(getEmail.otp)
        await userService.updateVerificationToken({ otp: otpJwt, id: userExist.dataValues.id })
      }
      await commonService.update(User, { is_verified: false }, { id: userExist.dataValues.id })
      const payload = { id: userExist.dataValues.id, username: userExist.dataValues.username, role: 1 }
      const token = await util.generateJwtToken(payload)
      userExist.dataValues.token = token
      delete userExist.dataValues.password
      delete userExist.dataValues.role
      delete userExist.dataValues.device_token
      delete userExist.dataValues.verification_token
      delete userExist.dataValues.social_user_id
      util.successResponse(res, config.constants.SUCCESS, langMsg.otpSent, userExist.dataValues)
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
        util.failureResponse(res, config.constants.NOT_FOUND, langMsg.notFound)
      }
      const resetPasswordToken = await util.generatePasswordReset()
      await userService.updateResetPasswordToken({ resetPasswordToken: resetPasswordToken, id: userExist.dataValues.id })
      const getResetPasswordToken = await userService.getResetPasswordToken(req.body)
      console.log('resetpasswordtakendetails', getResetPasswordToken)
      const resetPassword = await userService.resetPassword({ getResetPasswordToken: getResetPasswordToken.reset_password_token, getResetPasswordExpires: getResetPasswordToken.reset_password_expires, newPassword: req.body.password })
      if (!resetPassword) {
        util.failureResponse(res, config.constants.UNAUTHORIZED, langMsg.notFound)
      }
      userExist.dataValues.token = resetPasswordToken
      delete userExist.dataValues.password
      delete userExist.dataValues.role
      delete userExist.dataValues.device_token
      delete userExist.dataValues.verification_token
      delete userExist.dataValues.social_user_id
      util.successResponse(res, config.constants.SUCCESS, langMsg.passwordUpdated, userExist.dataValues)
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
      const getEmail = await util.sendEmail(userExist.dataValues.email, userExist.dataValues.name)
      if (getEmail) {
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
      util.successResponse(res, config.constants.SUCCESS, langMsg.otpSent, userExist.dataValues)
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
          role: '1'
        }
        userExistData = await userService.isUserAlreadyExist({ social_user_id: userData.social_user_id })
        console.log('isUserExist:', userExistData)
        console.log('msg:', config.messages.en.loginSuccess)
        if (userExistData) {
          const data = {
            id: userExistData.id,
            email: req.user.emails[0].value || req.user.email,
            role: '1',
            isActive: true
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
                id: socialData.id,
                email: req.user.emails[0].value || req.user.email,
                role: '1',
                isActive: true
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

  // By Bipin
  async editDetails (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    schema.editDetails.validateAsync(req.body).then(async () => {
      // const currentEmail = await commonService.findOne(User, { id: req.decoded.id }, ['email'])
      req.body.id = req.decoded.id
      const updateResult = await userService.editDetails(req.body) // commonService.update(User, req.body, { id: req.decoded.id })
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

  // By simnan
  // async editDetails (req, res) {
  //   const langMsg = config.messages[req.app.get('lang')]
  //   schema.editDetails.validateAsync(req.body).then(async () => {
  //     const currentEmail = await commonService.findOne(User, { id: req.decoded.id }, ['email'])
  //     const updateResult = await commonService.update(User, req.body, { id: req.decoded.id })
  //     console.log(currentEmail)
  //     console.log(JSON.stringify(updateResult))
  //     if (req.body.email !== currentEmail.email) {
  //       // const otp = await util.sendOTP(req.body.phone_number)
  //       const otp = await util.sendEmail(req.body.email, req.body.name)
  //       if (otp) {
  //         const otpJwt = await util.getJwtFromOtp(otp.otp)
  //         await commonService.update(User, { verification_token: otpJwt }, { id: req.decoded.id })
  //       }
  //       await commonService.update(User, { is_verified: false }, { id: req.decoded.id })
  //       util.successResponse(res, config.constants.ACCEPTED, langMsg.updateSuccess, {})
  //       return
  //     }
  //     util.successResponse(res, config.constants.SUCCESS, langMsg.updateSuccess, {})
  //   }, reject => {
  //     util.failureResponse(res, config.constants.BAD_REQUEST, reject.details[0].message)
  //   }).catch(err => {
  //     console.log(err)
  //     const errorMessage = err.name === 'CustomError' ? err.message : langMsg.internalServerError
  //     const errorCode = err.name === 'CustomError' ? config.constants.BAD_REQUEST : config.constants.INTERNAL_SERVER_ERROR
  //     util.failureResponse(res, errorCode, errorMessage)
  //   })
  // }

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
      // const followerName = await commonService.findOne(User, { id: req.decoded.id }, ['name'])

      // const sharedwithToken = await commonService.findAll(User, { id: req.params.user_id }, ['device_token'])
      // const payload = {
      //   message: {
      //     notification: {
      //       title: 'Paddle Notification ',
      //       body: followerName.dataValues.name + ' ' + ' started following you'
      //     }
      //   }
      // }
      // await notificationService.sendNotification(sharedwithToken, payload)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, {})
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
      const followingData = await userService.getFollowing(req.decoded)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, followingData)
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }

  async getFollowers (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const followerData = await userService.getFollowers(req.decoded)
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
      const data = await commonService.findAll(University, {})
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

  /*  async likePost (req, res) {
    const langMsg = config.messages[req.app.get('lang')]

    const validationResult = await schema.likePost.validateAsync(req.body)
    if (validationResult.error) {
      util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
      return
    }
    const alreadyLiked = await commonService.findOne(LikeUnlike, { user_id: req.decoded.id, media_type: req.query.media_type, media_id: req.body.media_id, is_liked: true })
    // console.log(alreadyLiked)
    try {
      if (alreadyLiked) {
        util.failureResponse(res, config.constants.CONFLICT, langMsg.conflict)
        return
      } else {
        const params = {
          user_id: req.decoded.id,
          is_liked: true,
          media_type: req.query.media_type,
          media_id: req.body.media_id
        }
        const data = await commonService.create(LikeUnlike, params)
        console.log(data)
        util.successResponse(res, config.constants.SUCCESS, langMsg.success, { })
      }
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  } */

  /*  async unlikePost (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const data = await commonService.update(LikeUnlike, { is_liked: false }, { user_id: req.decoded.id })
      console.log(data)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, { })
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  } */

  async submitStats (req, res) {
    const langMsg = config.messages[req.app.get('lang')]
    try {
      const validationResult = await schema.submitStats.validateAsync(req.body)
      if (validationResult.error) {
        util.failureResponse(res, config.constants.BAD_REQUEST, validationResult.error.details[0].message)
        return
      }
      console.log(validationResult)
      // let performQuery = true
      // let didOpenApp = false
      // response
      // const param = {}
      // if (validationResult.app_usage_time) {
      //   // update usage time
      //   param.app_usage_time = validationResult.app_usage_time
      // } else if (validationResult.did_open_app) {
      //   // increment open_count
      //   didOpenApp = true
      // } else {
      //   // do nothing
      //   performQuery = false
      // }
      // param.user_id = req.decoded.id
      // param.date = validationResult.date
      // param.university_id = null
      // param.app_usage_time = validationResult.app_usage_time
      // param.
      validationResult.user_id = req.decoded.id
      validationResult.university_id = null
      // if (performQuery) {
      const response = await userService.submitUserStats(validationResult)// commonService.createOrUpdate(UserStats, validationResult)
      // }
      console.log(response)
      util.successResponse(res, config.constants.SUCCESS, langMsg.success, { })
    } catch (err) {
      console.log(err)
      util.failureResponse(res, config.constants.INTERNAL_SERVER_ERROR, langMsg.internalServerError)
    }
  }
}
module.exports = UserController
