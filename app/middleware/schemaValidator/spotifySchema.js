const Joi = require('@hapi/joi')

const schema = {
  saveState: Joi.object().keys({
    connect: Joi.boolean().required()
  })
}
module.exports = schema
