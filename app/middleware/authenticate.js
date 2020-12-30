var passport = require('passport')
// var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user')
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var config = require('../config/index');
// exports.local = passport.use(new LocalStrategy(User.authenticate()));
require('dotenv').config()
const config = require('../config/index')


passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

exports.getToken = function (user) {
  return jwt.sign(user, config.JWT.secret, {
    expiresIn: 3600
  })
}

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT.secret;

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
  clientID: config.FACEBOOK.clientId,
  clientSecret: config.FACEBOOK.clientSecret
}, (accessToken, refreshToken, profile, done) => {
  // console.log("Profile is:", profile);
  if (profile.id) {
    return done(null, profile)
  }
}
));

exports.googlePassport = passport.use(new GoogleStrategy({
  clientID: config.GOOGLE.clientId,
  clientSecret: config.GOOGLE.clientSecret,
  callbackURL: config.GOOGLE.callbackURL,
},
  function (accessToken, refreshToken, profile, done) {
    // console.log("Google profile is:",profile)
    if (profile.id) {
      return done(null, profile);
    }
  }
));






