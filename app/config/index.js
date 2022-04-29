require('dotenv').config()
const messages = require('../locale/messages')
const constants = require('./constants')
const port = process.env.PORT || 8080

module.exports = {
  DB: {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DATABASE
  },
  JWT: {
    secret: process.env.JWT_SECRET
  },
  Twilio: {
    accountSid: process.env.TWILIO_AC_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  FACEBOOK: {
    clientId: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
  },
  GOOGLE: {
    clientId: process.env.GOOGLE_CLIENT_ID
    // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  SENDGRID: {
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.FROM_EMAIL
  },
  AWS: {
    id: process.env.AWS_ID,
    secret: process.env.AWS_SECRET,
    bucketName: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_REGION
  },
  FIREBASE: {
    vapidKey: process.env.VAPID_KEY
  },
  SPOTIFY: {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    ENCRYPTION_SECRET: process.env.SPOTIFY_ENCRYPTION_SECRET,
    CLIENT_CALLBACK_URL: process.env.SPOTIFY_CLIENT_CALLBACK_URL,
    URI: process.env.SPOTIFY_URI
  },
  port: port,
  baseURL: process.env.BASE_URL + 'auth/reset-password?token=',
  messages: messages,
  constants: constants
}
