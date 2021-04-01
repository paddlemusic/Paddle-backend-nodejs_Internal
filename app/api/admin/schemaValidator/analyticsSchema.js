const Joi = require('@hapi/joi')
// const JoiDate = require('@hapi/joi-date')
// Joi = Joi.extend(JoiDate)

const schema = {
  getStream: Joi.object().keys({
    // media_id: Joi.string().required(),
    university_id: Joi.number().required(),
    media_type: Joi.number().required(),
    page: Joi.number(),
    pageSize: Joi.number(),
    time_span: Joi.number()
  }),
  getSignups: Joi.object().keys({
    university_code: Joi.number().required()
  })

  /* getSignupsMonthly: Joi.object().keys({
    university_code: Joi.number().required(),
    year: Joi.number().required(),
    month: Joi.number().required()
  }),
  getStreamMonthly: Joi.object().keys({
    // media_id: Joi.string().required(),
    university_id: Joi.number().required(),
    media_type: Joi.number().required(),
    year: Joi.number().required(),
    month: Joi.number().required(),
    page: Joi.number(),
    pageSize: Joi.number()
  }) */
}

module.exports = schema
