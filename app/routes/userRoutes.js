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

/**
 * @swagger
 *
 * /edit_details:
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
 *        name : name
 *        type: string
 *        required: true
 *      - in: body
 *        name : username
 *        type: string
 *        required: true
 *      - in: body
 *        name : email
 *        type: string
 *        required: true
 *      - in: body
 *        name : phone_number
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
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

/**
 * @swagger
 *
 * /saveSongArtist/{type}:
 *   post:
 *     tags :
 *      - user
 *     summary: My SAVED SONGS and SAVED ARTISTS.
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
 *               - "6"
 *     definitions:
 *       TrackArtistIds :
 *       type : string
 *     description: >
 *       Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
 *     produces:
 *       - application/json
 */
router.post('/saveSongArtist/:type', authenticate.verifyToken, profileContoller.savedSongArtist)

/**
 * @swagger
 *
 * /deleteSongArtist/{type}:
 *   delete:
 *     tags :
 *      - user
 *     summary: Delete Your SAVED SONGS and SAVED ARTISTS.
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
 *       type : array
 *     description: >
 *       Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
 */
router.post('/deleteSongArtist/:type', authenticate.verifyToken, profileContoller.deleteSongArtist)

/**
 * @swagger
 *
 * /userShare:
 *   post:
 *     tags :
 *      - user
 *     summary: This resource will be used to create post from end user as a SHARE TO ALL post OR as SHARE TO FRIEND post.
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
 *        - in: body
 *          name : track_id
 *          description: track Id or music id.
 *          schema:
 *          type: string
 *          required : true
 *        - in: body
 *          name : caption
 *          description: caption.
 *          schema:
 *          type: string
 *        - in: body
 *          name : shared_with
 *          description: Shared with friend OR all  .
 *          schema:
 *          type: integer
 *          required: true
 *     description: >
 *       In case of SHARE TO ALL the "shared_with" field will be send blank else for SHARE TO FRIEND "shared_with" field will be the user_id of a friend.
 */

router.post('/userShare', auth.verifyToken, profileContoller.userShare)

/**
 * @swagger
 *
 * /getPostToAll:
 *   get:
 *     tags :
 *      - user
 *     summary: FOR SHARED TO ALL POST RESPONSE.
 *     description: >
 *      This resource will be used to get SHARED TO ALL post response from the end user .
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: query
 *        name: page
 *        schema:
 *        type: integer
 *        required: false
 *      - in: query
 *        name: pageSize
 *        schema:
 *        type: integer
 *        required: false
 *     produces:
 *       - application/json
 */

router.get('/getPostToAll', authenticate.verifyToken, profileContoller.getUserShareAsPost)

/**
 * @swagger
 *
 * /getPostToFriend/{shared_with}:
 *   get:
 *     tags :
 *      - user
 *     summary: FOR SHARED TO FRIEND POST RESPONSE.
 *     description: >
 *      This resource will be used to get SHARED TO FRIEND post response from the end user .
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */

router.get('/getPostToFriend/:shared_with', authenticate.verifyToken, profileContoller.getUserShareAsFriend)

/**
 * @swagger
 *
 * /user/playlist/create:
 *   post:
 *     tags :
 *      - user
 *     summary: Create a Playlist.
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
 *        - in: body
 *          name: body
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 *     responses:
 *          default:
 *              description: Create playlist response object.
 */
router.post('/playlist/create', authenticate.verifyToken, profileContoller.createPlaylist)

/**
 * @swagger
 *
 * /user/playlist/update/{playlist_id}:
 *   put:
 *     tags :
 *      - user
 *     summary: Update a Playlist's name and description.
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
 *          name: playlist_id
 *          type: integer
 *          required: true
 *        - in: body
 *          name: body
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 *     responses:
 *          default:
 *              description: Update playlist response object.
 */
router.put('/playlist/update/:playlist_id', authenticate.verifyToken, profileContoller.updatePlaylist)

/**
 * @swagger
 *
 * /user/playlist/delete/{playlist_id}:
 *   delete:
 *     tags :
 *      - user
 *     summary: Delete a Playlist.
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
 *          name: playlist_id
 *          type: integer
 *          required: true
 *     responses:
 *          default:
 *              description: Delete playlist response object.
 */
router.delete('/playlist/delete/:playlist_id', authenticate.verifyToken, profileContoller.deletePlaylist)

/**
 * @swagger
 *
 * /user/playlist:
 *   get:
 *     tags :
 *      - user
 *     summary: List all Playlists.
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
 *     responses:
 *          default:
 *              description: List all Playlists response object.
 */
router.get('/playlist', authenticate.verifyToken, profileContoller.getPlaylist)

/**
 * @swagger
 *
 * /user/playlist/{playlist_id}/addTracks:
 *   put:
 *     tags :
 *      - user
 *     summary: Add tracks to playlist.
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
 *          name: playlist_id
 *          type: integer
 *          required: true
 *        - in: body
 *          name: body
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  track_ids:
 *                      type: array
 *                      items:
 *                          type: string
 *                          unique: true
 *     responses:
 *          default:
 *              description: Add tracks to playlist response object.
 */
router.put('/playlist/:playlist_id/addTracks', authenticate.verifyToken, profileContoller.addTracks)

/**
 * @swagger
 *
 * /user/playlist/{playlist_id}/deleteTracks:
 *   delete:
 *     tags :
 *      - user
 *     summary: Delete tracks from a Playlist.
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
 *          name: playlist_id
 *          type: integer
 *          required: true
 *        - in: body
 *          name: body
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  track_ids:
 *                      type: array
 *                      items:
 *                          type: string
 *                          unique: true
 *     responses:
 *          default:
 *              description: Delete tracks from playlists response object.
 */
router.delete('/playlist/:playlist_id/deleteTracks', authenticate.verifyToken, profileContoller.deleteTracks)

/**
 * @swagger
 *
 * /user/playlist/{playlist_id}/tracks:
 *   get:
 *     tags :
 *      - user
 *     summary: Delete tracks from a Playlist.
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
 *          name: playlist_id
 *          type: integer
 *          required: true
 *     responses:
 *          default:
 *              description: Delete tracks from playlists response object.
 */
router.get('/playlist/:playlist_id/tracks', authenticate.verifyToken, profileContoller.getPlaylistTracks)
/**
 * @swagger
 *
 * /getRecentPosts:
 *   get:
 *     tags :
 *      - user
 *     summary: To Get Posts By End User.
 *     description: >
 *      This resource will be used to get all the POST(share to all OR share to friend) detail from the end user organized by most recent to least recent .
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
  *      - in: query
 *        name: page
 *        schema:
 *        type: integer
 *        required: false
 *      - in: query
 *        name: pageSize
 *        schema:
 *        type: integer
 *        required: false
 *     produces:
 *       - application/json
 */
router.get('/getRecentPosts', authenticate.verifyToken, profileContoller.getRecentPosts)
module.exports = router
