const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const userController = new UserController()

const auth = require('../../../middleware/authenticate')

/**
 * @swagger
 *
 * admin/login:
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
 * admin/logout:
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
 * admin/viewProfile:
 *   get:
 *     tags :
 *      - admin
 *     summary: For Viewing User Profile.
 *     description: >
 *      This resource will be used to view user profiles by the admin.
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *            type: string
 *        required: true
 *     produces:
 *       - application/json
 */
router.get('/viewProfile', auth.verifyToken, userController.getUserProfiles)

/**
 * @swagger
 *
 * admin/userSearch:
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
 *     produces:
 *       - application/json
 */
router.get('/userSearch', userController.userSearch)

/**
 * @swagger
 * admin/resetPassword:
 *   post:
 *     tags :
 *      - admin
 *     summary: To Reset Forgotten Password.
 *     description: >
 *      This resource will be used for individual to regenerate password .
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
 * admin/blockUnblock/{type}:
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
 *     produces:
 *       - application/json
 */
router.post('/blockUnblock/:type', userController.blockUnblockUser)
module.exports = router
