const express = require('express')
const router = express.Router()
const passport = require('passport');
const UserController = require('../controllers/userController')
const userController = new UserController()
const authenticate = require('../middleware/authenticate');

router.post('/signup', userController.signup)
router.get('/facebook/token', passport.authenticate('facebook-token'),userController.facebookSignup)



module.exports = router
