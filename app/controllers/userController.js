const config = require('../config')
const utils = require('../utils/utils')
const UserService = require('../services/userService')
const userService = new UserService()

class UserController {


    async signup(req, res) {
        userService.signup()
        // const langMsg = config.message[req.app.get('lang')]
        // schema.signup.validateAsync(req.body).then(() => {
        //     return util.encryptPassword(req.body.password).then(hash => {
        //         req.body.password = hash
        //         return userService.signup(req.body).then((result: any) => {
        //             if (result) {
        //                 util.sendOTP(result.dataValues.phone_number).then((message: any) => {
        //                     UserController.createSignupResponse(req, res, message, result)
        //                 }).catch(err => {
        //                     console.log(err.message)
        //                     UserController.createSignupResponse(req, res, null, result)
        //                 })
        //             }
        //         }, reject => {
        //             util.failureResponse(res, util.formatErrorMessage(reject), config.constants.badRequest)
        //         })
        //     })
        // }, reject => {
        //     util.failureResponse(res, reject.details[0].message, config.constants.badRequest)
        // }).catch(err => {
        //     console.log(err)
        //     util.failureResponse(res, langMsg.internalServerError, config.constants.internalServerError)
        // })
    }

}

module.exports = UserController