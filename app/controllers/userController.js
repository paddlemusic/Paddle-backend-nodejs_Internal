// const config = require('../config')
// const utils = require('../utils/utils')
const UserService = require('../services/userService')
const userService = new UserService()

class UserController {
  async signup (req, res) {
    userService.signup()
  }
}

module.exports = UserController
