const express = require('express')
const router = express.Router()
const HomePageController = require('../../../controllers/homePageController')
const homePageController = new HomePageController()
const authenticate = require('../../../middleware/authenticate')

/**
 * @swagger
 *
 * /createPost:
 *   post:
 *     tags :
 *      - home
 *     summary: Create User Post.
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
 *                  meta_data2:
 *                      type: string
 *                      required: false
 *                  shared_with:
 *                      type: integer
 *                      required: true
 *     description: >
 *       In case of shared with everyone=> value = null, shared with friend => value = userId(whom to share)
 */
router.post('/createPost/:media_type', authenticate.verifyToken, homePageController.createUserPost)

/**
 * @swagger
 *
 * /getPosts:
 *   get:
 *     tags :
 *      - home
 *     summary: get User posts.
 *     description: >
 *      This resource will be used for getting user's posts .
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
router.get('/getPosts', authenticate.verifyToken, homePageController.getUserPosts)

/**
 * @swagger
 *
 * /getUserSharedAsFriendPost/{shared_with}:
 *   get:
 *     tags :
 *      - home
 *     summary: get User posts by shared_with friend.
 *     description: >
 *      This resource will be used for getting shared with friend posts .
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: path
 *        name: shared_with
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */
// router.get('/getUserSharedAsFriendPost/:shared_with', authenticate.verifyToken, homePageController.getUserSharedAsFriendPost)
/**
 * @swagger
 *
 * /likeunlike/{post_id}/{type}:
 *   post:
 *     tags :
 *      - home
 *     summary: LIKE OR UNLIKE .
 *     description: >
 *      This resource will be used ffor liking and unliking .
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: path
 *        name: post_id
 *        schema:
 *        type: string
 *        required: true
 *      - in: path
 *        name: type
 *        schema:
 *        type: string
 *        required: true
 *        description: (type = like) to like a post & (type=unlike) to unlike a post
 *     produces:
 *       - application/json
 */

router.post('/likeunlike/:post_id/:type', authenticate.verifyToken, homePageController.likeUnlikePost)

module.exports = router
