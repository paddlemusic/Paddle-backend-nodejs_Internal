const authenticate = require('../middleware/authenticate')
const UserService = require('../services/userService')
const util = require('../utils/utils')
const config = require('../config/constants')
const userService = new UserService()

class UserController {
  async signup (req, res) {
    userService.signup(req, res)
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
