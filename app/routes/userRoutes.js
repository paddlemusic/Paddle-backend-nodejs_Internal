const express = require('express')
const router = express.Router()
const passport = require('passport')
const UserController = require('../controllers/userController')
const userController = new UserController()
const authenticate = require('../middleware/authenticate')

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: For Normal Signup.
 *     description: >
 *      This resource will be used for individual normal signup in the system.
 *     parameters:
 *      - in: body
 *        name: name
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: username
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: email
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: phone_number
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: password
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: university
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */

router.post('/signup', userController.signup)

/**
 * @swagger
 * /verify_otp:
 *   post:
 *     summary: To verify The Otp Recieved.
 *     description: >
 *      This resource will be used for individual to verify the otp recieved on registerd email.
 *     parameters:
 *      - in: body
 *        name: phonenumber
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: otp
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */

router.post('/verify_otp', userController.verifyOTP)
/**
 * @swagger
 *
 * /login:
 *   get:
 *     summary: For Login.
 *     description: >
 *      This resource will be used for individual login in the system.
 *     parameters:
 *      - in: body
 *        name: email
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: password
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */


router.get('/login', userController.login)
/**
 * @swagger
 *
 * /forgotPassword:
 *   get:
 *     summary: Forgot Password OTP Generation.
 *     description: >
 *      This resource will be used for individual to send OTP to registered email for new password generation.
 *     parameters:
 *      - in: body
 *        name: email
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */
router.get('/forgotPassword', userController.forgotPassword)

/**
 * @swagger
 * /resetPassword:
 *   post:
 *     summary: To Reset Forgotten Password.
 *     description: >
 *      This resource will be used for individual to regenerate password via otp verification.
 *     parameters:
 *      - in: body
 *        name: email
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: password
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */

router.post('/resetPassword', userController.resetPassword)

/**
 * @swagger
 *
 * /resend_Otp:
 *   get:
 *     summary: Resend OTP Verification.
 *     description: >
 *      This resource will be used for individual to send OTP again to the registered email if not recieved .
 *     parameters:
 *      - in: body
 *        name: email
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */
router.get('/resend_Otp', userController.resendOtp)
router.get('/facebook/token', passport.authenticate('facebook-token'), userController.socialMediaSignup)

// router.get('/error', (req, res) => res.send("error logging in"));
// router.get('/success', (req, res) => rconsole.log(res));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

/**
 * @swagger
 *
 * /auth/facebook/token:
 *   get:
 *     summary: For Signup with Facebook.
 *     description: >
 *      This resource will be used for individual signup with Facebook in the system.
 *      Facebook generated id will be saved in Database.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 *     externalDocs:
 *       description: Learn more about signup operations provided by this API.
 *       url: http://www.passportjs.org/docs/facebook/
 */

router.get('/auth/facebook/token', passport.authenticate('facebook-token'), userController.socialMediaSignup)
/**
 * @swagger
 *
 * /auth/google/token:
 *   post:
 *     summary: For Signup with Google.
 *     consumes:
 *        - application/json
 *     parameters:
 *        - in: body
 *          name : token
 *          description: Google Id token.
 *          schema:
 *          type: string
 *          required: true
 *     description: >
 *       This resource will be used for individual signup with Google in the system.
 *       Google generated id will be saved in Database.
 *     produces:
 *       - application/json
 *     externalDocs:
 *       description: Learn more about signup operations provided by this API.
 *       url: http://www.passportjs.org/docs/google/
 */
router.post('/auth/google/token', authenticate.googleSignIn, userController.socialMediaSignup)
router.post('/saveArtist', userController.saveArtist)
module.exports = router
