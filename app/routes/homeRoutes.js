const express = require('express')
const router = express.Router()
const HomePageController = require('../controllers/homePageController')
const homePageController = new HomePageController()
const authenticate = require('../middleware/authenticate')

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
 *          description: Shared with Friend/EveryOne .
 *          schema:
 *          type: string
 *          required: true
 *     description: >
 *       In case of shared with everyone=> value = null, shared with friend => value = userId(whom to share)
 */
router.post('/createPost', authenticate.verifyToken, homePageController.createUserPost)

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
router.get('/getUserSharedAsFriendPost/:shared_with', authenticate.verifyToken, homePageController.getUserSharedAsFriendPost)

module.exports = router
