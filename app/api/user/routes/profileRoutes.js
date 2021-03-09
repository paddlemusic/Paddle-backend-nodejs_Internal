const express = require('express')
const router = express.Router()

const ProfileController = require('../controllers/profileController')
const profileController = new ProfileController()

const authenticate = require('../../../middleware/authenticate')
const uploadMiddleware = require('../../../middleware/upload')

/**
 * @swagger
 *
 * /userSearch:
 *   get:
 *     tags :
 *      - Profile
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

// /**
//  * @swagger
//  *
//  * /songartistSearch:
//  *   get:
//  *     tags :
//  *      - Profile
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
// router.get('/songartistSearch', profileController.songartistSearch)

/**
 * @swagger
 *
 * /getProfile/{userId}:
 *   get:
 *     tags :
 *      - Profile
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
 *      - Profile
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

/**
 * @swagger
 *
 * /upload:
 *   post:
 *     tags :
 *      - Profile
 *     summary: To upload an image.
 *     produces:
 *       - application/json
 *     consumes:
 *        - multipart/form-data
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: formData
 *        name: image
 *        schema:
 *        type: file
 *        required: true
 *     responses:
 *          default:
 *              description: upload image to Amazon S3 bucket .
 */

router.post('/upload', authenticate.verifyToken, uploadMiddleware.upload, profileController.uploadFile)

/**
 * @swagger
 *
 * /checkPrivacy:
 *   put:
 *     tags :
 *      - Profile
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
 * /profile/edit_details:
 *   put:
 *     tags :
 *      - Profile
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
 *        name: phone_number
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: date_of_birth
 *        schema:
 *        type: string
 *        required: false
 *      - in: body
 *        name: bio
 *        schema:
 *        type: string
 *        required: false
 *        nullable: true
 *     responses:
 *          default:
 *              description: Update account deatails response object.
 */
router.put('/edit_details', authenticate.verifyToken, profileController.editDetails)

module.exports = router
