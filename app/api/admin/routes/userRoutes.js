const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const userController = new UserController()

const auth = require('../../../middleware/authenticate')
const uploadMiddleware = require('../../../middleware/upload')

/**
 * @swagger
 *
 * /login:
 *   post:
 *     tags:
 *      - admin
 *     summary: For Admin LOgin.
 *     description: >
 *      This resource will be used for admin login in the system.
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
 * /logout:
 *   post:
 *     tags :
 *      - admin
 *     summary: For Admin Logout.
 *     description: >
 *      This resource will be used to logout Admin by destroying device token.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *            type: string
 *        required: true
 *     produces:
 *       - application/json
 */
router.post('/logout', auth.verifyAdminToken, userController.logout)

/**
 * @swagger
 *
 * /viewAdminProfile:
 *   get:
 *     tags :
 *      - admin
 *     summary: For Viewing admin Profile.
 *     description: >
 *      This resource will be used to get profile of  the admin.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *            type: string
 *        required: true
 *     produces:
 *       - application/json
 */
router.get('/viewAdminProfile', auth.verifyAdminToken, userController.getAdminProfile)

/**
 * @swagger
 *
 * /upload:
 *   post:
 *     tags :
 *      - admin
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

router.post('/upload', auth.verifyAdminToken, uploadMiddleware.upload, userController.uploadFile)

/**
 * @swagger
 *
 * /viewUserProfile/{id}:
 *   get:
 *     tags :
 *      - admin
 *     summary: For Viewing user Profile.
 *     description: >
 *      This resource will be used to get profile of  the  users from admin panel.
 *     parameters:
 *      - in: params
 *        name: id
 *        schema:
 *            type: integer
 *        required: true
 *     produces:
 *       - application/json
 */
router.get('/viewUserProfile/:id', userController.getUserProfile)

/**
 * @swagger
 *
 * /userSearch:
 *   get:
 *     tags :
 *      - admin
 *     summary: T0 search user through name.
 *     description: >
 *      This resource will be used to search user on the basis of name in search bar .
 *     parameters:
 *      - in: query
 *        name: name
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
router.get('/userSearch', userController.userSearch)

/**
 * @swagger
 * /changePassword:
 *   post:
 *     tags :
 *      - admin
 *     summary: To change Password.
 *     description: >
 *      This resource will be used for admin to change password .
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *            type: string
 *        required: true
 *      - in: body
 *        name: old_password
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: new_password
 *        schema:
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 */

router.post('/changePassword', auth.verifyAdminToken, userController.changePassword)
/**
 * @swagger
 *
 * /blockUnblock/{type}:
 *   post:
 *     tags :
 *      - admin
 *     summary: Block Or Unblock .
 *     description: >
 *      This resource will be used ffor blocking and unblocking by the admin .
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *        type: string
 *        required: true
 *      - in: path
 *        name: type
 *        schema:
 *        type: string
 *        required: true
 *        description: (type = block) to block a user & (type=unblock) to unblock a user
 *      - in: body
 *        name: ids
 *        required: true
 *        description: ids of user to be deactivated from admin panel
 *        schema:
 *          type: array
 *          example: {
 *                "ids":[
 *                    17,
 *                    20
 *                      ]
 *                   }
 *     responses:
 *          default:
 *              description: Get list of niversities response object.
 */
router.post('/blockUnblock/:type', userController.blockUnblockUser)

/**
 * @swagger
 *
 * /edit_details:
 *   put:
 *     tags :
 *      - admin
 *     summary: To Edit Admin Details.
 *     description: >
 *      This resource will be used for an admin to update its details in context of profile.
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
 *      - in: body
 *        name: phone_number
 *        schema:
 *        type: string
 *     responses:
 *          default:
 *              description: Update account deatails response object.
 */

router.put('/editDetails', auth.verifyAdminToken, userController.editAdminDetails)

/**
 * @swagger
 *
 * /forgotPassword:
 *   post:
 *     tags :
 *      - admin
 *     summary: Password Reset Link Generate.
 *     description: >
 *      This resource will be used by admin to send reset password link.
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
 *      - admin
 *     summary: To Reset Forgotten Password.
 *     description: >
 *      This resource will be used for admin to regenerate password .
 *     parameters:
 *      - in: header
 *        name: MailToken
 *        schema:
 *        type: string
 *        required: true
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

router.post('/resetPassword', auth.verificationToken, userController.resetPassword)

/**
 * @swagger
 *
 * /getUsers:
 *   get:
 *     tags :
 *      - admin
 *     summary: Get Users.
 *     description: >
 *      This resource will be used to get all the users exist .
 *     parameters:
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
router.get('/getUsers', userController.getUsers)

module.exports = router
