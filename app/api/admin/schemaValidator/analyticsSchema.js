const Joi = require('@hapi/joi')
// const JoiDate = require('@hapi/joi-date')
// Joi = Joi.extend(JoiDate)

const schema = {
  getStream: Joi.object().keys({
    media_id: Joi.string().required(),
    university_id: Joi.number().required()
  }),
  getStreamMonthly: Joi.object().keys({
    media_id: Joi.string().required(),
    university_id: Joi.number().required(),
    month: Joi.number().required()
  })
}

module.exports = schema
