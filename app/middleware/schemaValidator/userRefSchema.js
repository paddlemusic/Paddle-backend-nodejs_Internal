const Joi = require('@hapi/joi')

const schema = {
  track: Joi.object().keys({
    ids: Joi.array().items(Joi.string()).unique()
  }),
  artist: Joi.object().keys({
    ids: Joi.array().items(Joi.string()).unique()
  })
}
module.exports = schema
