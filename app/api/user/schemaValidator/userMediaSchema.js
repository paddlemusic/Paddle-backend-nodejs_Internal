const Joi = require('@hapi/joi')

const schema = {
  saveArtist: Joi.object().keys({
    artist_id: Joi.string().required(),
    artist_name: Joi.string().required(),
    image_id: Joi.string()
  }),
  friend: Joi.object().keys({
    shared_with: Joi.number().min(1).required()
  }),
  playlist: Joi.object().keys({
    name: Joi.string().max(50).trim().allow(null).allow(''),
    description: Joi.string().max(200).trim().allow(null).allow(''),
    image: Joi.array().items(Joi.string().trim().uri().allow(null).allow(''))
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
  deleteTrack: Joi.object().keys({
    track_ids: Joi.array().items(Joi.string()).unique()
  }),
  rateApp: Joi.object().keys({
    rating: Joi.number().min(0).max(5).required(),
    feedback: Joi.string().max(300).trim()
  }),
  topMediaCount: Joi.object().keys({
    media_type: Joi.number().min(1).max(2).required(), // /^(1|2)/
    count: Joi.number().min(0).max(10).required() // /^(0|3|5|10)/
  }),
  track: Joi.object().keys({
    ids: Joi.array().items(Joi.string()).unique()
  }),
  artist: Joi.object().keys({
    ids: Joi.array().items(Joi.string()).unique()
  }),

  // media_type: Joi.number(),
  deleteMedia: Joi.object().keys({
    // media_id: Joi.array().items(Joi.string()).unique()
    ids: Joi.array().items(Joi.string()).unique()
  }),

  userMedia: Joi.object().keys({
    tracksData: Joi.array().items(Joi.object().keys({
      media_id: Joi.string().required(),
      media_image: Joi.string().allow('').allow(null),
      media_name: Joi.string().allow('').allow(null),
      meta_data: Joi.string().allow('').allow(null),
      meta_data2: Joi.string().allow('').allow(null)
    }))
  })
}

module.exports = schema
