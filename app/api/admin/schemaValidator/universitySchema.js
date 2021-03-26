const Joi = require('@hapi/joi')

const schema = {
  addUniversity: Joi.object().keys({
    name: Joi.string().trim().max(80).required(),
    city: Joi.string().max(80)
  }),
  deleteUniversity: Joi.object().keys({
    id: Joi.number().required()
  }),
  editUniversity: Joi.object().keys({
    name: Joi.string().trim().max(80),
    city: Joi.string().max(80)

  }),
  viewUniversity: Joi.object().keys({
    id: Joi.number().required()
  })
  // deleteUniversity: Joi.object().keys({
  //  university_ids: Joi.array().items(Joi.number()).unique()
  // })
}

module.exports = schema
