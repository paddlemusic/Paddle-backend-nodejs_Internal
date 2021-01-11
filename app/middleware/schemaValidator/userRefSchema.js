const Joi = require('@hapi/joi')

const schema = {
  track: Joi.object().keys({
    ids: Joi.array().items(Joi.string())
  }),
  artist: Joi.object().keys({
    ids: Joi.array().items(Joi.string())
  })
}
module.exports = schema
