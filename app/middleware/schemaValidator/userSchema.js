const Joi = require('@hapi/joi')

const schema = {
  login: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).max(30).required()
  }),
  signup: Joi.object().keys({
    name: Joi.string().trim().max(30).required(),
    username: Joi.string().trim().max(15),
    phone_number: Joi.string().trim().max(14).min(10).required(),
    email: Joi.string().trim().email().required(),
    university: Joi.number().min(1),
    password: Joi.string().trim().min(8).max(30).required()
  }),
  sendOTP: Joi.object().keys({
    email: Joi.string().trim().email().required()
  }),
  forgotPassword: Joi.object().keys({
    email: Joi.string().trim().email().required()
  }),
  verifyOTP: Joi.object().keys({
    phone_number: Joi.string().trim().min(10).max(14).required(),
    otp: Joi.string().trim().length(4).required()
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
  editDetails: Joi.object().keys({
    name: Joi.string().trim().max(30).required(),
    username: Joi.string().trim().max(15).required(),
    phone_number: Joi.string().trim().max(14).min(10).required(),
    email: Joi.string().trim().email().required(),
    date_of_birth: Joi.string().trim(), // .regex(/^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)d{4}$/),
    bio: Joi.string().trim().alphanum().max(300)
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
  userPost: Joi.object().keys({
    track_id: Joi.string().required(),
    caption: Joi.string().allow(null).allow(''),
    shared_with: Joi.string().allow(null).allow('').required()
  }),
  friend: Joi.object().keys({
    shared_with: Joi.number().min(1).required()
  })
}

module.exports = schema
