const express = require('express')
const router = express.Router()
const UserMediaController = require('../controllers/userMediaController')
const userMediaController = new UserMediaController()
const authenticate = require('../../../middleware/authenticate')

// const uploadMiddleware = require('../../../middleware/upload')

/**
 * @swagger
 *
 * /playlist/create:
 *   post:
 *     tags :
 *      - User Media
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
 *                  image:
 *                      type: array
 *                  playURI:
 *                      type: string
 *     responses:
 *          default:
 *              description: Create playlist response object.
 */
router.post('/playlist/create', authenticate.verifyToken, userMediaController.createPlaylist)

/**
 * @swagger
 *
 * /playlist/update/{playlist_id}:
 *   put:
 *     tags :
 *      - User Media
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
 *                  image:
 *                      type: array
 *                  playURI:
 *                      type: string
 *     responses:
 *          default:
 *              description: Update playlist response object.
 */
router.put('/playlist/update/:playlist_id', authenticate.verifyToken, userMediaController.updatePlaylist)

/**
 * @swagger
 *
 * /playlist/delete/{playlist_id}:
 *   delete:
 *     tags :
 *      - User Media
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
router.delete('/playlist/delete/:playlist_id', authenticate.verifyToken, userMediaController.deletePlaylist)

/**
 * @swagger
 *
 * /playlist:
 *   get:
 *     tags :
 *      - User Media
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
router.get('/playlist', authenticate.verifyToken, userMediaController.getPlaylist)

/**
 * @swagger
 *
 * /playlist/{playlist_id}/addTracks:
 *   put:
 *     tags :
 *      - User Media
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
 *        - in: body
 *          name: data
 *          description: Tracks Data.
 *          required: true
 *          schema:
 *            type: array
 *            items :
 *               $ref: '#/definitions/TrackArtistIds'
 *            example: {
 *                   "tracksData":[
 *                          {
 *                    "media_id": "1",
 *                    "playURI": "",
 *                    "artist_id": "",
 *                    "media_image": "",
 *                    "media_name": "song 1",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          },
 *                          {
 *                    "media_id": "2",
 *                    "playURI": "",
 *                    "album_id": "",
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

router.put('/playlist/:playlist_id/addTracks', authenticate.verifyToken, userMediaController.addTracks)

// /**
//  * @swagger
//  *
//  * /userShare/{type}:
//  *   post:
//  *     tags :
//  *      - User Media
//  *     summary: This resource will be used to create post from end user as a SHARE TO ALL post OR as SHARE TO FRIEND post.
//  *     produces:
//  *       - application/json
//  *     consumes:
//  *        - application/json
//  *     parameters:
//  *        - in: path
//  *          name: media_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for track & artist, 1 = track & 2 = artist
//  *        - in: body
//  *          name: body
//  *          required: true
//  *          description: In case of SHARE TO ALL the "shared_with" field will be send blank else for SHARE TO FRIEND "shared_with" field will be the user_id of a friend.
//  *          schema:
//  *              type: object
//  *              properties:
//  *                  media_id:
//  *                      type: string
//  *                      required: true
//  *                  caption:
//  *                      type: string
//  *                  media_image:
//  *                      type: string
//  *                      required: false
//  *                  meta_data:
//  *                      type: string
//  *                      required: false
//  *                  shared_with:
//  *                      type: string
//  *                      required: true
//  *     responses:
//  *          default:
//  *              description: Create playlist response object.
//  */

// router.post('/userShare/:media_type', authenticate.verifyToken, userMediaController.userShare)

// /**
//  * @swagger
//  *
//  * /getPostToAll:
//  *   get:
//  *     tags :
//  *      - User Media
//  *     summary: FOR SHARED TO ALL POST RESPONSE.
//  *     description: >
//  *      This resource will be used to get SHARED TO ALL post response from the end user .
//  *     parameters:
//  *      - in: header
//  *        name: Authorization
//  *        schema:
//  *        type: string
//  *        required: true
//  *      - in: query
//  *        name: page
//  *        schema:
//  *        type: integer
//  *        required: false
//  *      - in: query
//  *        name: pageSize
//  *        schema:
//  *        type: integer
//  *        required: false
//  *     produces:
//  *       - application/json
//  */

// router.get('/getPostToAll', authenticate.verifyToken, userMediaController.getUserShareAsPost)

/**
 * @swagger
 *
 * /playlist/{playlist_id}/deleteTracks:
 *   delete:
 *     tags :
 *      - User Media
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
router.delete('/playlist/:playlist_id/deleteTracks', authenticate.verifyToken, userMediaController.deleteTracks)

// /**
//  * @swagger
//  *
//  * /getPostToFriend/{shared_with}:
//  *   get:
//  *     tags :
//  *      - profile
//  *     summary: FOR SHARED TO FRIEND POST RESPONSE.
//  *     description: >
//  *      This resource will be used to get SHARED TO FRIEND post response from the end user .
//  *     parameters:
//  *      - in: header
//  *        name: Authorization
//  *        schema:
//  *        type: string
//  *        required: true
//  *      - in: path
//  *        name: shared_with
//  *        schema:
//  *        type: integer
//  *        required: true
//  *     produces:
//  *       - application/json
//  */

// router.get('/getPostToFriend/:shared_with', authenticate.verifyToken, userMediaController.getUserShareAsFriend)

/**
 * @swagger
 *
 * /playlist/{playlist_id}/tracks:
 *   get:
 *     tags :
 *      - User Media
 *     summary: Get tracks from a Playlist.
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
router.get('/playlist/:playlist_id/tracks', authenticate.verifyToken, userMediaController.getPlaylistTracks)

// /**
//  * @swagger
//  *
//  * /userMedia/topSongsArtists/{media_type}/{usermedia_type}:
//  *   put:
//  *     tags :
//  *      - profile
//  *     summary: My TOP SONGS and TOP ARTISTS.
//  *     consumes:
//  *        - application/json
//  *     parameters:
//  *        - in: header
//  *          name: Authorization
//  *          schema:
//  *          type: string
//  *          required: true
//  *        - in: path
//  *          name: media_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for track & artist, 1 = track & 2 = artist
//  *        - in: path
//  *          name: usermedia_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
//  *        - in: body
//  *          name: data
//  *          description: Tracks Or artist Data.
//  *          required: true
//  *          schema:
//  *            type: array
//  *            items :
//  *               $ref: '#/definitions/TrackArtistIds'
//  *            example: {
//  *                   "tracksData":[
//  *                          {
//  *                    "media_id": "1",
//  *                    "media_image": "",
//  *                    "media_name": "song 1",
//  *                    "meta_data": "",
//  *                    "meta_data2": "",
//  *                          },
//  *                          {
//  *                    "media_id": "2",
//  *                    "media_image": "",
//  *                    "media_name": "song 2",
//  *                    "meta_data": "",
//  *                    "meta_data2": "",
//  *                          }
//  *                          ]
//  *                     }
//  *   definitions:
//  *     TrackArtistIds:
//  *      type: "object"
//  *      properties:
//  *          media_id:
//  *            type: string
//  *            required:  true
//  *          media_image:
//  *            type: string
//  *          media_name:
//  *            type: string
//  *          meta_data:
//  *            type: string
//  *          meta_data2:
//  *            type: string
//  *   description: >
//  *    Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
//  *     produces:
//  *       - application/json
//  */
// router.put('/userMedia/topSongsArtists/:media_type/:usermedia_type', authenticate.verifyToken, profileController.createUserMedia)

/**
 * @swagger
 *
 * /getRecentPosts:
 *   get:
 *     tags :
 *      - User Media
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
router.get('/getRecentPosts', authenticate.verifyToken, userMediaController.getRecentPosts)

// /**
//  * @swagger
//  *
//  * /userMedia/deleteTopSongsArtists/{media_type}/{usermedia_type}:
//  *   delete:
//  *     tags :
//  *      - profile
//  *     summary: Delete Your TOP SONGS and TOP ARTISTS.
//  *     produces:
//  *       - application/json
//  *     consumes:
//  *        - application/json
//  *     parameters:
//  *        - in: header
//  *          name: Authorization
//  *          schema:
//  *          type: string
//  *          required: true
//  *        - in: path
//  *          name: media_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for track & artist, 1 = track & 2 = artist
//  *        - in: path
//  *          name: usermedia_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
//  *        - in: body
//  *          name : ids
//  *          description: Tracks Or artist Ids.
//  *          required : true
//  *          schema:
//  *            type: array
//  *            items :
//  *               $ref: '#/definitions/TrackArtistIds'
//  *            example:
//  *               - "5"
//  *     definitions:
//  *       TrackArtistIds :
//  *       type : string
//  *     description: >
//  *       Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
//  */

// router.delete('/userMedia/deleteTopSongsArtists/:media_type/:usermedia_type', authenticate.verifyToken, profileController.deleteUserMedia)

// /**
//  * @swagger
//  *
//  * /userMedia/saveSongsArtists/{media_type}/{usermedia_type}:
//  *   put:
//  *     tags :
//  *      - profile
//  *     summary: My SAVED SONGS and SAVED ARTISTS.
//  *     consumes:
//  *        - application/json
//  *     parameters:
//  *        - in: header
//  *          name: Authorization
//  *          schema:
//  *          type: string
//  *          required: true
//  *        - in: path
//  *          name: type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for track & artist, 1 = track & 2 = artist
//  *        - in: path
//  *          name: usermedia_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
//  *        - in: body
//  *          name: data
//  *          description: Tracks Or artist Data.
//  *          required: true
//  *          schema:
//  *            type: array
//  *            items :
//  *               $ref: '#/definitions/TrackArtistIds'
//  *            example: {
//  *                   "data":[
//  *                          {
//  *                    "media_id": "1",
//  *                    "media_image": "",
//  *                    "media_name": "song 1",
//  *                    "meta_data": "",
//  *                    "meta_data2": "",
//  *                          },
//  *                          {
//  *                    "media_id": "2",
//  *                    "media_image": "",
//  *                    "media_name": "song 2",
//  *                    "meta_data": "",
//  *                    "meta_data2": "",
//  *                          }
//  *                          ]
//  *                     }
//  *   definitions:
//  *     TrackArtistIds:
//  *      type: "object"
//  *      properties:
//  *          media_id:
//  *            type: string
//  *            required:  true
//  *          media_image:
//  *            type: string
//  *          media_name:
//  *            type: string
//  *          meta_data:
//  *            type: string
//  *          meta_data2:
//  *            type: string
//  *   description: >
//  *    Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
//  *     produces:
//  *       - application/json
//  */
// router.put('/userMedia/saveSongsArtists/:media_type/:usermedia_type', authenticate.verifyToken, profileController.createUserMedia)

// /**
//  * @swagger
//  *
//  * /userMedia/deleteSaveSongsArtists/{media_type}/{usermedia_type}:
//  *   delete:
//  *     tags :
//  *      - profile
//  *     summary: Delete Your SAVED SONGS and SAVED ARTISTS.
//  *     produces:
//  *       - application/json
//  *     consumes:
//  *        - application/json
//  *     parameters:
//  *        - in: header
//  *          name: Authorization
//  *          schema:
//  *          type: string
//  *          required: true
//  *        - in: path
//  *          name: media_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for track & artist, 1 = track & 2 = artist
//  *        - in: path
//  *          name: usermedia_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
//  *        - in: body
//  *          name : ids
//  *          description: Tracks Or artist Ids.
//  *          required : true
//  *          schema:
//  *            type: array
//  *            items :
//  *               $ref: '#/definitions/TrackArtistIds'
//  *            example:
//  *               - "5"
//  *     definitions:
//  *       TrackArtistIds :
//  *       type : string
//  *     description: >
//  *       Whenever tracks or artist will added, all related track_ids & artist_ids will be send in the array
//  */

// router.delete('/userMedia/deleteSaveSongsArtists/:media_type/:usermedia_type', authenticate.verifyToken, profileController.deleteUserMedia)

// /**
//  * @swagger
//  *
//  * /userSearch:
//  *   get:
//  *     tags :
//  *      - profile
//  *     summary: T0 search user through name.
//  *     description: >
//  *      This resource will be used to search user on the basis of name in search bar .
//  *     parameters:
//  *      - in: query
//  *        name: name
//  *        schema:
//  *        type: string
//  *        required: true
//  *     produces:
//  *       - application/json
//  */
// router.get('/userSearch', userMediaController.userSearch)

// /**
//  * @swagger
//  *
//  * /songartistSearch:
//  *   get:
//  *     tags :
//  *      - profile
//  *     summary: T0 search user through name.
//  *     description: >
//  *      This resource will be used to search user on the basis of name in search bar .
//  *     parameters:
//  *      - in: query
//  *        name: media_name
//  *        schema:
//  *        type: string
//  *        required: true
//  *     produces:
//  *       - application/json
//  */
// router.get('/songartistSearch', userMediaController.trackArtistSearch)

// /**
//  * @swagger
//  *
//  * /userMedia/getSaveSongsArtists/{media_type}/{usermedia_type}:
//  *   get:
//  *     tags :
//  *      - profile
//  *     summary: Get SAVED SONGS and SAVED ARTISTS.
//  *     consumes:
//  *        - application/json
//  *     parameters:
//  *        - in: header
//  *          name: Authorization
//  *          schema:
//  *          type: string
//  *          required: true
//  *        - in: path
//  *          name: media_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for track & artist, 1 = track & 2 = artist
//  *        - in: path
//  *          name: usermedia_type
//  *          schema:
//  *          type: integer
//  *          required: true
//  *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
//  *   description: >
//  *    Shows user saved song and artists
//  *     produces:
//  *       - application/json
//  */
// router.get('/userMedia/getSaveSongsArtists/:media_type/:usermedia_type', authenticate.verifyToken, profileController.getUserMedia)

/**
 * @swagger
 *
 * /{usermedia_type}/{media_type}:
 *   put:
 *     tags :
 *      - User Media
 *     summary: Add tracks/artist to Top and Saved Songs/Artist
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
 *          name: media_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: path
 *          name: usermedia_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
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
 *                    "playURI": "",
 *                    "artist_id": "",
 *                    "album_id": "",
 *                    "media_image": "",
 *                    "media_name": "song 1",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          },
 *                          {
 *                    "media_id": "2",
 *                    "playURI": "",
 *                    "artist_id": "",
 *                    "album_id": "",
 *                    "media_image": "",
 *                    "media_name": "song 2",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          }
 *                          ]
 *                     }
 *          definitions:
 *              TrackArtistIds:
 *                  type: object
 *                  properties:
 *                          media_id:
 *                              type: string
 *                              required:  true
 *                          playURI:
 *                              type: string
 *                              required:  false
 *                          media_image:
 *                              type: string
 *                          media_name:
 *                              type: string
 *                          meta_data:
 *                              type: string
 *                          meta_data2:
 *                              type: string
 *     responses:
 *          default:
 *              description: Add tracks/artist to Top and Saved Songs/Artist
 */
router.put('/:usermedia_type/:media_type', authenticate.verifyToken, userMediaController.createUserMedia)

/**
 * @swagger
 *
 * /{usermedia_type}/{media_type}/order:
 *   put:
 *     tags :
 *      - User Media
 *     summary: Order tracks/artist to Top and Saved Songs/Artist
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
 *          name: media_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: path
 *          name: usermedia_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
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
 *                    "playURI": "",
 *                    "artist_id": "",
 *                    "album_id": "",
 *                    "media_image": "",
 *                    "media_name": "song 1",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          },
 *                          {
 *                    "media_id": "2",
 *                    "playURI": "",
 *                    "artist_id": "",
 *                    "album_id": "",
 *                    "media_image": "",
 *                    "media_name": "song 2",
 *                    "meta_data": "",
 *                    "meta_data2": "",
 *                          }
 *                          ]
 *                     }
 *          definitions:
 *              TrackArtistIds:
 *                  type: object
 *                  properties:
 *                          media_id:
 *                              type: string
 *                              required:  true
 *                          playURI:
 *                              type: string
 *                              required:  false
 *                          artist_id:
 *                              type: string
 *                              required:  false
 *                          album_id:
 *                              type: string
 *                              required:  false
 *                          media_image:
 *                              type: string
 *                          media_name:
 *                              type: string
 *                          meta_data:
 *                              type: string
 *                          meta_data2:
 *                              type: string
 *                          order:
 *                              type: number
 *     responses:
 *          default:
 *              description: Order tracks/artist to Top and Saved Songs/Artist
 */
router.put('/:usermedia_type/:media_type/order', authenticate.verifyToken, userMediaController.orderUserMedia)

/**
 * @swagger
 *
 * /get/{usermedia_type}/{media_type}:
 *   get:
 *     tags :
 *      - User Media
 *     summary: Get tracks/artist to Top and Saved Songs/Artist
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
 *          name: media_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: path
 *          name: usermedia_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
 *     responses:
 *          default:
 *              description: Get tracks/artist to Top and Saved Songs/Artist
 */
router.get('/get/:usermedia_type/:media_type', authenticate.verifyToken, userMediaController.getUserMedia)

/**
 * @swagger
 *
 * /search/{usermedia_type}/{media_type}:
 *   get:
 *     tags :
 *      - User Media
 *     summary: Search tracks/artist to Top and Saved Songs/Artist
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
 *          name: media_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: path
 *          name: usermedia_type
 *          schema:
 *          type: integer
 *          required: true
 *        - in: query
 *          name: keyword
 *          schema:
 *          type: string
 *          required: true
 *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
 *     responses:
 *          default:
 *              description: Search tracks/artist to Top and Saved Songs/Artist
 */
router.get('/search/:usermedia_type/:media_type', authenticate.verifyToken, userMediaController.trackArtistSearch)

/**
 * @swagger
 *
 * /{usermedia_type}/{media_type}:
 *   delete:
 *     tags :
 *      - User Media
 *     summary: Delete tracks/artist to Top and Saved Songs/Artist
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
 *          name: media_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: path
 *          name: usermedia_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for topSongArtist & savedSongArtist, 1 = topSongArtist & 2 = savedSongArtist
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
 *     responses:
 *          default:
 *              description: Delete tracks/artist to Top and Saved Songs/Artist
 */
router.delete('/:usermedia_type/:media_type', authenticate.verifyToken, userMediaController.deleteUserMedia)

/**
 * @swagger
 *
 * /{media_type}/{count}:
 *   post:
 *     tags :
 *      - User Media
 *     summary: Set/update Top artitst/tracks
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
 *          name: media_type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *        - in: path
 *          name: count
 *          schema:
 *          type: integer
 *          required: true
 *          description: count in range of 0, 3, 5, 10.
 *        - in: path
 *          name: playURI
 *          schema:
 *          type: string
 *          required: false
 *     responses:
 *          default:
 *              description: Set/update Top artitst/tracks
 */
router.post('/:media_type/:count', authenticate.verifyToken, userMediaController.updateTopMediaCount)

/**
 * @swagger
 *
 * /isSaved/{media_id}:
 *   get:
 *     tags :
 *      - User Media
 *     summary: Check if media is saved or not.
 *     description: >
 *      This resource will be used Check if media is saved or not.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: path
 *        name: media_id
 *        schema:
 *        type: integer
 *        required: true
 *     responses:
 *          default:
 *              description: This resource will be used Check if media is saved or not.
 */

router.get('/isSaved/:media_id', authenticate.verifyToken, userMediaController.isMediaSaved)

/**
 * @swagger
 *
 * /{media_type}/cover:
 *   get:
 *     tags :
 *      - User Media
 *     summary: Fetch cover image of saved songs/artist
 *     description: >
 *      This resource will Fetch cover image of saved songs/artist.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: path
 *        name: media_id
 *        schema:
 *        type: integer
 *        required: true
 *     responses:
 *          default:
 *              description: This resource will Fetch cover image of saved songs/artist.
 */

router.get('/:media_type/cover', authenticate.verifyToken, userMediaController.getCoverImage)

module.exports = router
