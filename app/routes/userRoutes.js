const express = require('express')
const router = express.Router()
const passport = require('passport');
const UserController = require('../controllers/userController')
const userController = new UserController()


router.post('/signup', userController.signup)



/**
 * @swagger
 *
 * /facebook/token:
 *   get:
 *     summary: For Signup with Facebook.
 *     description: >
 *      This resource will be used for individual signup with Facebook in the system.
 *      Facebook generated id will be saved in Database. 
 *     produces:
 *       - application/json
 *     externalDocs:
 *       description: Learn more about signup operations provided by this API.
 *       url: http://www.passportjs.org/docs/facebook/
 */

router.get('/facebook/token', passport.authenticate('facebook-token'), userController.socialMediaSignup)

// router.get('/error', (req, res) => res.send("error logging in"));



/**
 * @swagger
 *
 * /auth/google:
 *   get:
 *     summary: For Signup with Google.
 *     description: >
 *      This resource will be used for individual signup with Google in the system.
 *      Google generated id will be saved in Database. 
 *     produces:
 *       - application/json
 *     externalDocs:
 *       description: Learn more about signup operations provided by this API.
 *       url: http://www.passportjs.org/docs/google/
 */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'paddle/api/v1/user/error' }),
    userController.socialMediaSignup);



module.exports = router
