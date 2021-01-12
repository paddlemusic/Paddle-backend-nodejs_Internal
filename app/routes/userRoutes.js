const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const userController = new UserController()
const ProfileController = require('../controllers/profileContoller')
const profileContoller = new ProfileController()
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
 *     tags :
 *      - user
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
router.get('/login', userController.login)

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
 * /following:
 *   get:
 *     tags :
 *      - user
 *     summary: For fetching the list of users you are following.
 *     description: >
 *      This resource will be used for fetching the list of users you are following.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *     produces:
 *       - application/json
 */
router.get('/following', auth.verifyToken, userController.getFollowing)

/**
 * @swagger
 *
 * /forgotPassword:
 *   get:
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
router.get('/forgotPassword', userController.forgotPassword)

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
 * /followers:
 *   get:
 *     tags :
 *      - user
 *     summary: For fetching the list of followers.
 *     description: >
 *      This resource will be used for fetching the list of followers.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *     produces:
 *       - application/json
 */
router.get('/followers', auth.verifyToken, userController.getFollowers)

/**
 * @swagger
 *
 * /resend_Otp:
 *   get:
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
router.get('/resend_Otp', userController.resendOtp)

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
router.post('/saveArtist', userController.saveArtist)

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
 * /trackArtist/{type}:
 *   post:
 *     tags :
 *      - user
 *     summary: My TOP SONGS and TOP ARTISTS.
 *     consumes:
 *        - application/json
 *     parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *          type: string
 *          required: true
 *        - in: path
 *          name: type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: body
 *          name : ids
 *          description: Tracks Or artist Ids.
 *          required : true
 *          schema:
 *            type: array
 *            items :
 *               $ref: '#/definitions/TrackArtistIds'
 *            example:
 *               - "5"
 *     definitions:
 *       TrackArtistIds :
 *       type : string
 *     description: >
 *       Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
 *     produces:
 *       - application/json
 */
router.post('/trackArtist/:type', authenticate.verifyToken, profileContoller.saveTrackArtist)

/**
 * @swagger
 *
 * /deleteTrackArtist/{type}:
 *   delete:
 *     tags :
 *      - user
 *     summary: Delete Your TOP SONGS and TOP ARTISTS.
 *     produces:
 *       - application/json
 *     consumes:
 *        - application/json
 *     parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *          type: string
 *          required: true
 *        - in: path
 *          name: type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: body
 *          name : ids
 *          description: Tracks Or artist Ids.
 *          required : true
 *          schema:
 *            type: array
 *            items :
 *               $ref: '#/definitions/TrackArtistIds'
 *            example:
 *               - "5"
 *     definitions:
 *       TrackArtistIds :
 *       type : string
 *     description: >
 *       Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
 */
router.delete('/deleteTrackArtist/:type', authenticate.verifyToken, profileContoller.deleteTrackArtist)

module.exports = router
