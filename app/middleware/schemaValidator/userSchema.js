const Joi = require('@hapi/joi')

const schema = {
  login: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).max(30).required()
  }),
  signup: Joi.object().keys({
    name: Joi.string().trim().max(30).required(),
    username: Joi.string().trim().max(15),
    phone_number: Joi.string().trim().max(16).min(10).required(),
    email: Joi.string().trim().email().required(),
    university_code: Joi.number().min(1),
    password: Joi.string().trim().min(8).max(30).required()

  }),
  sendOTP: Joi.object().keys({
    email: Joi.string().trim().email().required()
  }),
  forgotPassword: Joi.object().keys({
    email: Joi.string().trim().email().required()
  }),
  verifyOTP: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    otp: Joi.string().trim().length(4).required()
  }),
  resetPassword: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).max(26).required()
  }),
  saveArtist: Joi.object().keys({
    artist_id: Joi.string().required(),
    artist_name: Joi.string().required(),
    image_id: Joi.string()
  }),
  editDetails: Joi.object().keys({
    name: Joi.string().trim().max(30).required(),
    username: Joi.string().trim().max(30).required(),
    phone_number: Joi.string().trim().max(17).min(10).required(),
    // email: Joi.string().trim().email().required(),
    date_of_birth: Joi.string().trim(), // .regex(/^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)d{4}$/),
    // bio: Joi.string().trim().alphanum().max(300)
    biography: Joi.string().trim().max(300).allow(null).allow('')
  }),
  follow: Joi.object().keys({
    user_id: Joi.number().min(1).required()
  }),
  unfollow: Joi.object().keys({
    user_id: Joi.number().min(1).required()
  }),
  changePassowrd: Joi.object().keys({
    old_password: Joi.string().required(),
    new_password: Joi.string().min(6).max(26).required()
  }),
  userShare: Joi.object().keys({
    media_id: Joi.string().required(),
    caption: Joi.string().allow(null).allow(''),
    media_image: Joi.string().allow('').allow(null),
    media_name: Joi.string().allow('').allow(null),
    meta_data: Joi.string().allow('').allow(null),
    shared_with: Joi.number().allow(null).required()
  }),
  userPost: Joi.object().keys({
    media_id: Joi.string().required(),
    caption: Joi.string().allow(null).allow(''),
    media_image: Joi.string().allow('').allow(null),
    media_name: Joi.string().allow('').allow(null),
    meta_data: Joi.string().allow('').allow(null),
    meta_data2: Joi.string().allow('').allow(null),
    shared_with: Joi.number().allow(null).required()
  }),
  friend: Joi.object().keys({
    shared_with: Joi.number().min(1).required()
  }),
  playlist: Joi.object().keys({
    name: Joi.string().max(50).trim().allow(null).allow(''),
    description: Joi.string().max(200).trim().allow(null).allow(''),
    image: Joi.string().trim().allow(null).allow('')
  }),
  deletePlaylist: Joi.object().keys({
    playlist_id: Joi.number().min(1).required()
  }),
  tracks: Joi.object().keys({
    tracksData: Joi.array().items(Joi.object().keys({
      media_id: Joi.string().required(),
      media_image: Joi.string().allow('').allow(null),
      media_name: Joi.string().allow('').allow(null),
      meta_data: Joi.string().allow('').allow(null),
      meta_data2: Joi.string().allow('').allow(null)
    }))
  }),
  userPrivacy: Joi.object().keys({
    is_privacy: Joi.boolean().required()
  }),
  likePost: Joi.object().keys({
    media_id: Joi.string().required()
  }),
  rateApp: Joi.object().keys({
    rating: Joi.number().min(0).max(5).required(),
    feedback: Joi.string().max(300).trim()
  }),
  likeUnlikePost: Joi.object().keys({
    post_id: Joi.number().required(),
    type: Joi.string().required()
  })
}

module.exports = schema
