const Joi = require('@hapi/joi') 
const authSchema = Joi.object({ 
    name: Joi.string().max(30).required(),
    username: Joi.string().max(30).required(),
    //phone_number: Joi.string().max(14).min(10).required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).max(26).required()
})
module.exports = {
    authSchema,
}
