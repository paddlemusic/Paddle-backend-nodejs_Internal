let Joi = require('@hapi/joi')
const JoiDate = require('@hapi/joi-date')
Joi = Joi.extend(JoiDate)

const schema = {
  getStream: Joi.object().keys({
    media_id: Joi.string().required(),
    media_type: Joi.integer().required(),
    university_id: Joi.integer().required(),
    date: Joi.date().format('YYYY-MM-DD').required()
  })
}

module.exports = schema
