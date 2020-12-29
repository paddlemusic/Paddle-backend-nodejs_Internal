var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');
var config = require('../config/index');
const util = require('../utils/utils');
// exports.local = passport.use(new LocalStrategy(User.authenticate()));
const dbConfig = require('../config/dbConfig')


// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});




exports.getToken = function (user) {
  return jwt.sign(user, config.JWT.secret, {
    expiresIn: 3600
  });
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT.secret;

exports.facebookPassport = 
  passport.use(new FacebookTokenStrategy({
    clientID: config.FACEBOOK.clientId,
    clientSecret: config.FACEBOOK.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    // console.log("Profile is:", profile);
       if(profile.id){
        return done(null,profile)
       }
          } 
  ));

