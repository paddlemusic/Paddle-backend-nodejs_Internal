const express = require('express')
const router = express.Router()
const passport = require('passport')
const UserController = require('../controllers/userController')
const userController = new UserController()
const authenticate = require('../middleware/authenticate')

router.post('/signup', userController.signup)

router.post('/verify_otp', userController.verifyOTP)
router.get('/login', userController.login)
router.get('/forgotPassword', userController.forgotPassword)
router.get('/facebook/token', passport.authenticate('facebook-token'), userController.socialMediaSignup)

// router.get('/error', (req, res) => res.send("error logging in"));
// router.get('/success', (req, res) => rconsole.log(res));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

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

router.get('/auth/facebook/token', passport.authenticate('facebook-token'), userController.socialMediaSignup)
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
