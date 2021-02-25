require('dotenv').config()
const config = require('../config/index')
const passport = require('passport')
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const FacebookTokenStrategy = require('passport-facebook-token')
const { OAuth2Client } = require('google-auth-library')
const googleClient = new OAuth2Client(config.GOOGLE.clientId)
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
    console.log('Facebook acessToken:', accessToken)
    return done(null, profile)
  }
}
))

exports.googleSignIn = function (req, res, next) {
  // console.log('Body is:', req.body.token)
  const langMsg = config.messages[req.app.get('lang')]
  return googleClient
    .verifyIdToken({
      idToken: req.body.token,
      audience: config.GOOGLE.clientId
    })
    .then(login => {
      // if verification is ok, google returns a jwt
      const payload = login.getPayload()
      console.log('Payload is:', payload)
      // const userid = payload['sub']
      // check if the jwt is issued for our client
      const audience = payload.aud
      if (audience !== config.GOOGLE.clientId) {
        throw new Error(
          'error while authenticating google user: audience mismatch: wanted [' +
          config.GOOGLE.clientId +
            '] but was [' +
            audience +
            ']'
        )
      }
      // promise the creation of a user
      return {
        displayName: payload.name, // profile name
        pic: payload.picture, // profile pic
        id: payload.sub, // google id
        email_verified: payload.email_verified,
        emails: [{ value: payload.email }]
      }
    })
    .then(user => {
      req.user = user
      next()
      // return user;
    })
    .catch(err => {
      // throw an error if something gos wrong
      util.failureResponse(res, config.constants.UNAUTHORIZED, langMsg.invalidToken)

      throw new Error(
        'error while authenticating google user: ' + JSON.stringify(err)
      )
    })
}

exports.facebookSignIn = function (req, res, next) {
  const langMsg = config.messages[req.app.get('lang')]
  passport.authenticate('facebook-token', function (err, user, info) {
    console.log('User is:', user)
    if (err) {
      console.log('Err is:', err)
      util.failureResponse(res, config.constants.UNAUTHORIZED, langMsg.invalidToken)
    }
    if (user) {
      console.log(user)
      req.user = user
      next()
    }
  })(req, res, next)
}
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
        console.log('DEcoded is:', decoded)
        if (Number(decoded.role) !== config.constants.ROLE.USER) {
          util.failureResponse(res, config.constants.FORBIDDEN, LangMsg.invaldRole)
        } else if (!decoded.is_active) {
          util.failureResponse(res, config.constants.FORBIDDEN, LangMsg.userDeactivated)
        } else if (!decoded.is_verified &&
          !(req.path !== '/verify_otp' ||
          req.path !== '/resend_otp' ||
          req.path !== '/changeEmail')) {
          util.failureResponse(res, config.constants.FORBIDDEN, LangMsg.userNotVerfied)
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

exports.verifyAdminToken = (req, res, next) => {
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
        // console.log('DEcoded is:', decoded)
        if (Number(decoded.role) !== 2) {
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
