const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const userController = new UserController()
const auth = require('../middleware/authenticate')
const authenticate = require('../middleware/authenticate')

/**
 * @swagger
 * /signup:
 *   post:
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

router.post('/verify_otp', userController.verifyOTP)
/**
 * @swagger
 *
 * /login:
 *   get:
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
router.put('/edit_details', auth.verifyToken, userController.editDetails)

/**
 * @swagger
 *
 * /auth/facebook/token:
 *   get:
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
module.exports = router
