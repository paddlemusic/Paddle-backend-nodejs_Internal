const Joi = require('@hapi/joi')

const schema = {
  login: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).max(30).required()
  }),
  blockUnblockUser: Joi.object().keys({
    type: Joi.string().required()
  })
}

module.exports = schema
