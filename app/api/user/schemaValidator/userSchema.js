let Joi = require('@hapi/joi')
const JoiDate = require('@hapi/joi-date')
Joi = Joi.extend(JoiDate)

const schema = {
  login: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).max(30).required()
  }),
  signup: Joi.object().keys({
    name: Joi.string().trim().max(30).required(),
    username: Joi.string().trim().max(15),
    phone_number: Joi.string().trim().max(16).min(10).required(),
    email: Joi.string().trim().email().required(),
    university_code: Joi.number().min(0).allow(null),
    password: Joi.string().trim().min(8).max(30).required(),
    passcode: Joi.string().trim().max(30).min(6).required(),
    profile_picture: Joi.string().trim().uri().allow('').allow(null)
  }),
  sendOTP: Joi.object().keys({
    email: Joi.string().trim().email().required()
  }),
  forgotPassword: Joi.object().keys({
    email: Joi.string().trim().email().required()
  }),
  verifyOTP: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    otp: Joi.string().trim().length(4).required()
  }),
  changeEmailAddress: Joi.object().keys({
    email: Joi.string().trim().email().required()
  }),
  resetPassword: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).max(26).required()
  }),
  saveArtist: Joi.object().keys({
    artist_id: Joi.string().required(),
    artist_name: Joi.string().required(),
    image_id: Joi.string()
  }),
  follow: Joi.object().keys({
    user_id: Joi.number().min(1).required()
  }),
  unfollow: Joi.object().keys({
    user_id: Joi.number().min(1).required()
  }),
  changePassowrd: Joi.object().keys({
    old_password: Joi.string().required(),
    new_password: Joi.string().min(6).max(26).required()
  }),
  rateApp: Joi.object().keys({
    rating: Joi.number().min(0).max(5).required(),
    feedback: Joi.string().max(300).trim()
  }),
  submitStats: Joi.object().keys({
    app_usage_time: Joi.number().min(0).default(0),
    did_open_app: Joi.boolean().default(false)
    // date: Joi.date().format('YYYY-MM-DD').required()
  }),
  updateDeviceToken: Joi.object().keys({
    device_token: Joi.string().trim().required()
  })
}

module.exports = schema
