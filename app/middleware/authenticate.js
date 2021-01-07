require('dotenv').config()
const passport = require('passport')
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const FacebookTokenStrategy = require('passport-facebook-token')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const config = require('../config/index')
const util = require('../utils/utils')

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

exports.verifyToken = (req, res, next) => {
  const secret = config.JWT.secret
  const token = req.headers.authorization
  const LangMsg = config.messages[req.app.get('lang')]
  if (token) {
    console.log(req.path)
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log(LangMsg.invalidToken)
        util.failureResponse(res, config.constants.BAD_REQUEST, LangMsg.invalidToken)
      } else {
        console.log(decoded)
        if (Number(decoded.role) !== 1) {
          util.failureResponse(res, config.constants.FORBIDDEN, LangMsg.invaldRole)
        } else if (!decoded.is_active) {
          util.failureResponse(res, config.constants.FORBIDDEN, LangMsg.userDeactivated)
        } else {
          req.decoded = decoded
          next()
        }
      }
    })
  } else {
    util.failureResponse(res, config.constants.UNAUTHORIZED, LangMsg.tokenMissing)
  }
}
