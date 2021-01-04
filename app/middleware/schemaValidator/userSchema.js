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
  })
}

module.exports = schema
