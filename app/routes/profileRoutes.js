const express = require('express')
const router = express.Router()
const ProfileController = require('../controllers/profileController')
const profileController = new ProfileController()
const authenticate = require('../middleware/authenticate')

const uploadMiddleware = require('../middleware/upload')

/**
 * @swagger
 *
 * /playlist/create:
 *   post:
 *     tags :
 *      - profile
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
router.post('/playlist/create', authenticate.verifyToken, profileController.createPlaylist)

/**
 * @swagger
 *
 * /playlist/update/{playlist_id}:
 *   put:
 *     tags :
 *      - profile
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
router.put('/playlist/update/:playlist_id', authenticate.verifyToken, profileController.updatePlaylist)

/**
 * @swagger
 *
 * /playlist/delete/{playlist_id}:
 *   delete:
 *     tags :
 *      - profile
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
router.delete('/playlist/delete/:playlist_id', authenticate.verifyToken, profileController.deletePlaylist)

/**
 * @swagger
 *
 * /playlist:
 *   get:
 *     tags :
 *      - profile
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
router.get('/playlist', authenticate.verifyToken, profileController.getPlaylist)

/**
 * @swagger
 *
 * /playlist/{playlist_id}/{media_type}/addTracks:
 *   put:
 *     tags :
 *      - profile
 *     summary: To Add Tracks To Playlist.
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
 *        - in: path
 *          name: media_type
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: body
 *          name: data
 *          description: Tracks Or artist Data.
 *          required: true
 *          schema:
 *            type: array
 *            items :
 *               $ref: '#/definitions/TrackArtistIds'
 *            example: {
 *                   "tracksData":[
 *                          {
 *                    "media_id": "1",
 *                    "media_image": "",
 *                    "media_name": "song 1",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          },
 *                          {
 *                    "media_id": "2",
 *                    "media_image": "",
 *                    "media_name": "song 2",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          }
 *                          ]
 *                     }
 *   definitions:
 *     TrackArtistIds:
 *      type: "object"
 *      properties:
 *          media_id:
 *            type: string
 *            required:  true
 *          media_image:
 *            type: string
 *          media_name:
 *            type: string
 *          meta_data:
 *            type: string
 *          meta_data2:
 *            type: string
 *   description: >
 *    Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
 *     produces:
 *       - application/json
 */

router.put('/playlist/:playlist_id/:media_type/addTracks', authenticate.verifyToken, profileController.addTracks)
/**
 * @swagger
 *
 * /userShare/{type}:
 *   post:
 *     tags :
 *      - profile
 *     summary: This resource will be used to create post from end user as a SHARE TO ALL post OR as SHARE TO FRIEND post.
 *     produces:
 *       - application/json
 *     consumes:
 *        - application/json
 *     parameters:
 *        - in: path
 *          name: media_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: body
 *          name: body
 *          required: true
 *          description: In case of SHARE TO ALL the "shared_with" field will be send blank else for SHARE TO FRIEND "shared_with" field will be the user_id of a friend.
 *          schema:
 *              type: object
 *              properties:
 *                  media_id:
 *                      type: string
 *                      required: true
 *                  caption:
 *                      type: string
 *                  media_image:
 *                      type: string
 *                      required: false
 *                  meta_data:
 *                      type: string
 *                      required: false
 *                  shared_with:
 *                      type: string
 *                      required: true
 *     responses:
 *          default:
 *              description: Create playlist response object.
 */

router.post('/userShare/:media_type', authenticate.verifyToken, profileController.userShare)

/**
 * @swagger
 *
 * /getPostToAll:
 *   get:
 *     tags :
 *      - profile
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

router.get('/getPostToAll', authenticate.verifyToken, profileController.getUserShareAsPost)

/**
 * @swagger
 *
 * /playlist/{playlist_id}/deleteTracks:
 *   delete:
 *     tags :
 *      - profile
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
router.delete('/playlist/:playlist_id/deleteTracks', authenticate.verifyToken, profileController.deleteTracks)

/**
 * @swagger
 *
 * /getPostToFriend/{shared_with}:
 *   get:
 *     tags :
 *      - profile
 *     summary: FOR SHARED TO FRIEND POST RESPONSE.
 *     description: >
 *      This resource will be used to get SHARED TO FRIEND post response from the end user .
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: path
 *        name: shared_with
 *        schema:
 *        type: integer
 *        required: true
 *     produces:
 *       - application/json
 */

router.get('/getPostToFriend/:shared_with', authenticate.verifyToken, profileController.getUserShareAsFriend)

/**
 * @swagger
 *
 * /playlist/{playlist_id}/tracks:
 *   get:
 *     tags :
 *      - profile
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
router.get('/playlist/:playlist_id/tracks', authenticate.verifyToken, profileController.getPlaylistTracks)

/**
 * @swagger
 *
 * /userMedia/topSongsArtists/{type}:
 *   put:
 *     tags :
 *      - profile
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
 *          name: data
 *          description: Tracks Or artist Data.
 *          required: true
 *          schema:
 *            type: array
 *            items :
 *               $ref: '#/definitions/TrackArtistIds'
 *            example: {
 *                   "tracksData":[
 *                          {
 *                    "media_id": "1",
 *                    "media_image": "",
 *                    "media_name": "song 1",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          },
 *                          {
 *                    "media_id": "2",
 *                    "media_image": "",
 *                    "media_name": "song 2",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          }
 *                          ]
 *                     }
 *   definitions:
 *     TrackArtistIds:
 *      type: "object"
 *      properties:
 *          media_id:
 *            type: string
 *            required:  true
 *          media_image:
 *            type: string
 *          media_name:
 *            type: string
 *          meta_data:
 *            type: string
 *          meta_data2:
 *            type: string
 *   description: >
 *    Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
 *     produces:
 *       - application/json
 */
router.put('/userMedia/topSongsArtists/:media_type', authenticate.verifyToken, profileController.createUserMedia)

/**
 * @swagger
 *
 * /getRecentPosts:
 *   get:
 *     tags :
 *      - profile
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
router.get('/getRecentPosts', authenticate.verifyToken, profileController.getRecentPosts)

/**
 * @swagger
 *
 * /userMedia/deleteTopSongsArtists/{type}:
 *   delete:
 *     tags :
 *      - profile
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

router.delete('/userMedia/deleteTopSongsArtists/:media_type', authenticate.verifyToken, profileController.deleteUserMedia)

/**
 * @swagger
 *
 * /userMedia/saveSongsArtists/{type}:
 *   put:
 *     tags :
 *      - profile
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
 *          name: data
 *          description: Tracks Or artist Data.
 *          required: true
 *          schema:
 *            type: array
 *            items :
 *               $ref: '#/definitions/TrackArtistIds'
 *            example: {
 *                   "data":[
 *                          {
 *                    "media_id": "1",
 *                    "media_image": "",
 *                    "media_name": "song 1",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          },
 *                          {
 *                    "media_id": "2",
 *                    "media_image": "",
 *                    "media_name": "song 2",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          }
 *                          ]
 *                     }
 *   definitions:
 *     TrackArtistIds:
 *      type: "object"
 *      properties:
 *          media_id:
 *            type: string
 *            required:  true
 *          media_image:
 *            type: string
 *          media_name:
 *            type: string
 *          meta_data:
 *            type: string
 *          meta_data2:
 *            type: string
 *   description: >
 *    Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
 *     produces:
 *       - application/json
 */
router.put('/userMedia/saveSongsArtists/:media_type', authenticate.verifyToken, profileController.createUserMedia)

/**
 * @swagger
 *
 * /userMedia/deleteSaveSongsArtists/{type}:
 *   delete:
 *     tags :
 *      - profile
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
 *       type : string
 *     description: >
 *       Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
 */

router.delete('/userMedia/deleteSaveSongsArtists/:media_type', authenticate.verifyToken, profileController.deleteUserMedia)

/**
 * @swagger
 *
 * /userSearch:
 *   get:
 *     tags :
 *      - profile
 *     summary: T0 search user through name.
 *     description: >
 *      This resource will be used to search user on the basis of name in search bar .
 *     parameters:
 *      - in: query
 *        name: name
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */
router.get('/userSearch', profileController.userSearch)

/**
 * @swagger
 *
 * /songartistSearch:
 *   get:
 *     tags :
 *      - profile
 *     summary: T0 search user through name.
 *     description: >
 *      This resource will be used to search user on the basis of name in search bar .
 *     parameters:
 *      - in: query
 *        name: media_name
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */
router.get('/songartistSearch', profileController.songartistSearch)

/**
 * @swagger
 *
 * /getProfile/{userId}:
 *   get:
 *     tags :
 *      - profile
 *     summary: Get User Profile by UserId.
 *     produces:
 *       - application/json
 *     consumes:
 *        - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: path
 *        name: userId
 *        schema:
 *        type: integer
 *        required: true
 *     responses:
 *          default:
 *              description: Get list of Profile response object.
 */

router.get('/getProfile/:userId', authenticate.verifyToken, profileController.getProfile)

/**
 * @swagger
 *
 * /profile/getAccountDetails:
 *   get:
 *     tags :
 *      - profile
 *     summary: Get User Account details.
 *     produces:
 *       - application/json
 *     consumes:
 *        - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *     responses:
 *          default:
 *              description: Get user account details response object.
 */

router.get('/getAccountDetails', authenticate.verifyToken, profileController.getAccountDetails)

router.post('/upload', authenticate.verifyToken, uploadMiddleware.upload, profileController.uploadFile)

/**
 * @swagger
 *
 * /checkPrivacy:
 *   put:
 *     tags :
 *      - profile
 *     summary: Toggle Privacy Settings.
 *     produces:
 *       - application/json
 *     consumes:
 *        - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: is_privacy
 *        description: privacy on and off
 *        schema:
 *        type: boolean
 *        required: true
 */

router.put('/checkPrivacy', authenticate.verifyToken, profileController.checkUserPrivacy)

/**
 * @swagger
 *
 * /userMedia/getSaveSongsArtists/{type}:
 *   get:
 *     tags :
 *      - profile
 *     summary: Get SAVED SONGS and SAVED ARTISTS.
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
 *   description: >
 *    Shows user saved song and artists
 *     produces:
 *       - application/json
 */
router.get('/userMedia/getSaveSongsArtists/:media_type', authenticate.verifyToken, profileController.getUserMedia)
module.exports = router
