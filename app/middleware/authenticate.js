require('dotenv').config()
const passport = require('passport')
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const FacebookTokenStrategy = require('passport-facebook-token')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
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
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.JWT.secret

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
  clientID: config.FACEBOOK.clientId,
  clientSecret: config.FACEBOOK.clientSecret
}, (accessToken, refreshToken, profile, done) => {
  if (profile.id) {
    return done(null, profile)
  }
}
))

exports.googlePassport = passport.use(new GoogleStrategy({
  clientID: config.GOOGLE.clientId,
  clientSecret: config.GOOGLE.clientSecret,
  callbackURL: config.GOOGLE.callbackURL
},
function (accessToken, refreshToken, profile, done) {
  if (profile.id) {
    return done(null, profile)
  }
}
))
