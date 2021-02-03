const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const userController = new UserController()
// const ProfileController = require('../controllers/profileController')
// const profileContoller = new ProfileController()

const auth = require('../middleware/authenticate')
const authenticate = require('../middleware/authenticate')

/**
 * @swagger
 * /signup:
 *   post:
 *     tags :
 *     - user
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
 *        name: university_code
 *        schema:
 *        type: integer
 *        required: true
 *     produces:
 *       - application/json
 */

router.post('/signup', userController.signup)

/**
 * @swagger
 * /verify_otp:
 *   post:
 *     tags :
 *      - user
 *     summary: To verify The Otp Recieved.
 *     description: >
 *      This resource will be used for individual to verify the otp recieved on registerd email.
 *     parameters:
 *      - in: body
 *        name: email
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
 *   post:
 *     tags:
 *      - user
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
router.post('/login', userController.login)

/**
 * @swagger
 *
 * /follow/{user_id}:
 *   post:
 *     tags :
 *      - user
 *     summary: For following users.
 *     description: >
 *      This resource will be used for following other users.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *            type: string
 *      - in: path
 *        name: user_id
 *        schema:
 *            type: int64
 *     produces:
 *       - application/json
 */
router.post('/follow/:user_id', auth.verifyToken, userController.follow)

/**
 * @swagger
 *
 * /unfollow/{user_id}:
 *   delete:
 *     tags :
 *      - user
 *     summary: For unfollowing users.
 *     description: >
 *      This resource will be used for unfollowing other users.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *            type: string
 *      - in: path
 *        name: user_id
 *        schema:
 *            type: int64
 *     produces:
 *       - application/json
 */
router.delete('/unfollow/:user_id', auth.verifyToken, userController.unfollow)

/**
 * @swagger
 *
 * /user/following:
 *   get:
 *     tags :
 *      - user
 *     summary: For fetching the list of users you are following.
 *     description: >
 *      This resource will be used for fetching the list of users you are following.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *     responses:
 *          default:
 *              description: Update playlist response object.
 */
router.get('/following', auth.verifyToken, userController.getFollowing)

/**
 * @swagger
 *
 * /forgotPassword:
 *   post:
 *     tags :
 *      - user
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
router.post('/forgotPassword', userController.forgotPassword)

/**
 * @swagger
 * /resetPassword:
 *   post:
 *     tags :
 *      - user
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
 * /user/followers:
 *   get:
 *     tags :
 *      - user
 *     summary: For fetching the list of followers.
 *     description: >
 *      This resource will be used for fetching the list of followers.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *     responses:
 *          default:
 *              description: Update playlist response object.
 */
router.get('/followers', auth.verifyToken, userController.getFollowers)

/**
 * @swagger
 *
 * /resend_Otp:
 *   post:
 *     tags :
 *      - user
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
router.post('/resend_Otp', userController.resendOtp)

/**
 * @swagger
 *
 * /user/edit_details:
 *   put:
 *     tags :
 *      - user
 *     summary: To Edit User Details.
 *     description: >
 *      This resource will be used for an individual to update its details in context of profile.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *           type: object
 *           properties:
 *               name:
 *                   type: string
 *               username:
 *                   type: string
 *               phone_number:
 *                   type: string
 *               date_of_birth:
 *                   type: string
 *               biography:
 *                   type: string
 *     responses:
 *          default:
 *              description: Update account deatails response object.
 */

router.put('/edit_details', auth.verifyToken, userController.editDetails)

/**
 * @swagger
 *
 * /auth/facebook/token:
 *   get:
 *     tags :
 *      - user
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
router.get('/auth/facebook/token', authenticate.facebookSignIn, userController.socialMediaSignup)
/**
 * @swagger
 *
 * /auth/google/token:
 *   post:
 *     tags :
 *      - user
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

/**
 * @swagger
 *
 * /changePassword:
 *   post:
 *     tags :
 *      - user
 *     summary: Reset password.
 *     consumes:
 *        - application/json
 *     parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *          type: string
 *          required: true
 *        - in: body
 *          name : old_password
 *          description: Old password.
 *          schema:
 *          type: string
 *          required: true
 *        - in: body
 *          name : new_password
 *          description: New password.
 *          schema:
 *          type: string
 *          required: true
 *        - in: body
 *          name : confirm_password
 *          description: Confirm password.
 *          schema:
 *          type: string
 *          required: true
 *     description: >
 *       This resource will be used for changing the password
 *     produces:
 *       - application/json
 */
router.post('/changePassword', authenticate.verifyToken, userController.changePassword)

/**
 * @swagger
 *
 * /user/university:
 *   get:
 *     tags :
 *      - user
 *     summary: Get list of universities.
 *     produces:
 *       - application/json
 *     consumes:
 *        - application/json
 *     responses:
 *          default:
 *              description: Get list of niversities response object.
 */
router.get('/university', userController.getUniversity)

/**
 * @swagger
 *
 * /user/countries:
 *   get:
 *     tags :
 *      - user
 *     summary: Get list of country code.
 *     produces:
 *       - application/json
 *     consumes:
 *        - application/json
 *     responses:
 *          default:
 *              description: Get list of niversities response object.
 */
router.get('/countries', userController.getCountryCallingCode)

/**
 * @swagger
 *
 * /user/isUsernameAvailable:
 *   get:
 *     tags :
 *      - user
 *     summary: Check if username is available or not.
 *     produces:
 *       - application/json
 *     consumes:
 *        - application/json
 *     responses:
 *          default:
 *              description: isUsernameAvailable response object.
 */
router.get('/isUsernameAvailable', auth.verifyToken, userController.isUsernameAvailable)

router.post('/rateApp', auth.verifyToken, userController.rateApp)

router.get('/rateApp', auth.verifyToken, userController.getRateApp)

module.exports = router
