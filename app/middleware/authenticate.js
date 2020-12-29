var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
var config = require('../config/index');
const util = require('../utils/utils');
// exports.local = passport.use(new LocalStrategy(User.authenticate()));
const dbConfig = require('../config/dbConfig')
require('dotenv').config()


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

  exports.googlePassport =  passport.use(new GoogleStrategy({
    // clientID:     config.GOOGLE.clientId,
    // clientSecret: config.GOOGLE.clientSecret ,
    // callbackURL:  config.GOOGLE.callbackURL,
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : 'http://localhost:8080/auth/google/callback',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log("Google profile is:",profile)
    // return done(null, profile);
    // process.nextTick(function () {
      return done(null, profile);
    // });
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));


