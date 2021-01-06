const express = require('express')
const router = express.Router()
const passport = require('passport')
const UserController = require('../controllers/userController')
const userController = new UserController()

router.post('/signup', userController.signup)
router.post('/verify_otp', userController.verifyOTP)
router.get('/login', userController.login)
router.get('/forgotPassword', userController.forgotPassword)
router.get('/facebook/token', passport.authenticate('facebook-token'), userController.socialMediaSignup)

// router.get('/error', (req, res) => res.send("error logging in"));
// router.get('/success', (req, res) => rconsole.log(res));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'paddle/api/v1/user/error' }),
  userController.socialMediaSignup)

module.exports = router
