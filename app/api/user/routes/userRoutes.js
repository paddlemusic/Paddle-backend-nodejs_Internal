const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const userController = new UserController()
// const ProfileController = require('../controllers/profileController')
// const profileContoller = new ProfileController()

const auth = require('../../../middleware/authenticate')
const authenticate = require('../../../middleware/authenticate')
const uploadMiddleware = require('../../../middleware/upload')

/**
 * @swagger
 * /signup:
 *   post:
 *     tags :
 *     - User
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
 *        required: false
 *      - in: body
 *        name: profile_picture
 *        schema:
 *        type: string
 *        required: false
 *     produces:
 *       - application/json
 */

router.post('/signup', userController.signup)

/**
 * @swagger
 * /verify_otp:
 *   post:
 *     tags :
 *      - User
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

router.post('/changeEmail', auth.verifyToken, userController.changeEmailAddress)

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *      - User
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
 *      - User
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
 *      - User
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
 *      - User
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
 *      - User
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
 *      - User
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
 * /upload:
 *   post:
 *     tags :
 *      - User
 *     summary: To upload an image.
 *     produces:
 *       - application/json
 *     consumes:
 *        - multipart/form-data
 *     parameters:
 *      - in: formData
 *        name: image
 *        schema:
 *        type: file
 *        required: true
 *     responses:
 *          default:
 *              description: upload image to Amazon S3 bucket .
 */
router.post('/upload', uploadMiddleware.upload, userController.uploadFile)

/**
 * @swagger
 *
 * /user/followers:
 *   get:
 *     tags :
 *      - User
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
 * /user/followers/search:
 *   get:
 *     tags :
 *      - User
 *     summary: For searching followers.
 *     description: >
 *      This resource will be used for for searching followers..
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: query
 *        name: keyword
 *        type: string
 *        required: true
 *     responses:
 *          default:
 *              description: For searching followers.
 */
router.get('/followers/search', auth.verifyToken, userController.searchFollowers)

/**
 * @swagger
 *
 * /resend_Otp:
 *   post:
 *     tags :
 *      - User
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
 * /auth/facebook/token:
 *   get:
 *     tags :
 *      - User
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
 *      - User
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
 *      - User
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
 *      - User
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
 *      - User
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
 *      - User
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

router.post('/deviceToken', auth.verifyToken, userController.updateDeviceToken)

router.post('/rateApp', auth.verifyToken, userController.rateApp)

router.get('/rateApp', auth.verifyToken, userController.getRateApp)
/**
 * @swagger
 *
 * /logout:
 *   post:
 *     tags :
 *      - User
 *     summary: LOGOUT.
 *     description: >
 *      This resource will be used to logout users by destroying device token.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *            type: string
 *        required: true
 *     produces:
 *       - application/json
 */
router.post('/logout', auth.verifyToken, userController.logout)
// router.put('/like', auth.verifyToken, userController.likePost)
// router.get('/getlikes', userController.getLikes)
// router.put('/unlike', auth.verifyToken, userController.unlikePost)

/**
 * @swagger
 *
 * /user/submitStats:
 *   post:
 *     tags :
 *      - User
 *     summary: To store user data
 *     description: >
 *      This resource will be used for storing user data
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name : body
 *        required : true
 *        schema:
 *           type: object
 *           properties:
 *              app_usage_time:
 *                 type: number
 *              did_open_app:
 *                 type: boolean
 *     responses:
 *          default:
 *              This resource will be used for storing user data
 */
router.post('/submitStats', auth.verifyToken, userController.submitStats)

module.exports = router
