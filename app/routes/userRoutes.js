const express = require('express')
const router = express.Router()
const passport = require('passport');
const UserController = require('../controllers/userController')
const userController = new UserController()

router.post('/signup', userController.signup)
router.get('/facebook/token', passport.authenticate('facebook-token'),userController.facebookSignup)

router.get('/auth/google', passport.authenticate('google',
 { scope: ['profile', 'email'],
 accessType: 'offline',
 prompt: 'consent', }))
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/paddle/api/v1/user/signup', session: false }),
  function(req, res) {
    console.log("REs:", res.user);
    // Successful authentication, redirect home.
    // res.redirect('/');
  });
 


module.exports = router
