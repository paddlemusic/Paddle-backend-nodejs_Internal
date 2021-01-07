const Joi = require('@hapi/joi')

const schema = {
  login: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).max(30).required()
  }),
  signup: Joi.object().keys({
    name: Joi.string().trim().max(30).required(),
    username: Joi.string().trim().max(15).required(),
    phone_number: Joi.string().trim().max(14).min(10).required(),
    email: Joi.string().trim().email().required(),
    university: Joi.number().min(1),
    password: Joi.string().trim().min(8).max(30).required()
  }),
  sendOTP: Joi.object().keys({
    username: Joi.string().required()
  }),
  fortgetPassword: Joi.object().keys({
    username: Joi.string().required()
  }),
  verifyOTP: Joi.object().keys({
    phone_number: Joi.string().trim().min(10).max(14).required(),
    otp: Joi.string().trim().length(4).required()
  }),
  resetPassword: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(6).max(26).required()
  }),
  editDetails: Joi.object().keys({
    name: Joi.string().trim().max(30).required(),
    username: Joi.string().trim().max(15).required(),
    phone_number: Joi.string().trim().max(14).min(10).required(),
    email: Joi.string().trim().email().required(),
    date_of_birth: Joi.string().trim(), // .regex(/^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)d{4}$/),
    bio: Joi.string().trim().alphanum().max(300).required()
  }),
  follow: Joi.object().keys({
    user_id: Joi.number().min(1).required()
  }),
  unfollow: Joi.object().keys({
    user_id: Joi.number().min(1).required()
  })
}

module.exports = schema
