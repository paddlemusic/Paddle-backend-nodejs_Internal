const Joi = require('@hapi/joi')

const schema = {
  login: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).max(30).required()
  }),
  blockUnblockUser: Joi.object().keys({
    ids: Joi.array().items(Joi.number()).unique(),
    type: Joi.string()
  }),

  resetPassword: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).max(26).required()
  }),
  changePassowrd: Joi.object().keys({
    old_password: Joi.string().required(),
    new_password: Joi.string().min(6).max(26).required()
  })
}

module.exports = schema
