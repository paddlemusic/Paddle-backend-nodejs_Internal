const UniversityTrending = require('../../../models/universityTrending')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../../../models')
const moment = require('moment')
// eslint-disable-next-line no-unused-vars
const StreamStats = require('../../../models/streamStats')

class ChartService {
  // async addMedia (params) {
  //   return new Promise((resolve, reject) => {
  //     UniversityTrending.findOne({
  //       where: {
  //         university_id: params.university_id,
  //         media_id: params.media_id,
  //         media_type: params.media_type
  //       }
  //     }).then(findResult => {
  //       if (findResult) {
  //         findResult.increment('count')
  //       } else {
  //         UniversityTrending.create(params)
  //           .then((university) => { university.increment('count') })
  //       }
  //     }).then(result => resolve(result))
  //       .catch(err => reject(err))
  //   })
  // }

  async submitStramingStats (params) {
    console.log(params)
    let values = ''
    params.forEach(param => {
      if (values.length) { values += ',' }
      const value = `(${param.university_id} , '${param.media_id}', ${param.media_type}, '${JSON.stringify(param.media_metadata)}', '${param.date}','${param.playURI || ''}','${param.artist_id || ''}','${param.album_id || ''}')`// added play_uri,artist_id,album_id
      values += value
    })
    const rawQuery =
             `INSERT INTO
                "Stream_Stats" (
                university_id,
                media_id,
                media_type,
                media_metadata,
                "date",
                play_uri,
                artist_id,
                album_id)
              VALUES ${values} 
              ON CONFLICT 
                (university_id,
                  media_id,
                  media_type,
                  "date")
              DO UPDATE
              SET
                count = "Stream_Stats".count + 1`
    console.log(rawQuery)
    const data = await sequelize.query(rawQuery, {
      // bind: [params.user_id, params.university_id, params.date, params.app_usage_time, 1]
    })
    console.log(data)
    return data
  }

  async addArtist (params) {
    return new Promise((resolve, reject) => {
      UniversityTrending.findOne({
        where: {
          university_id: params.university_id,
          media_id: params.media_id,
          media_type: params.media_type
        }
      }).then(findResult => {
        if (findResult) {
          findResult.increment('count')
        } else {
          UniversityTrending.create(params)
            .then((university) => { university.increment('count') })
        }
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  fetchChartOld (universityId, mediaType, pagination) {
    return new Promise((resolve, reject) => {
      StreamStats.findAndCountAll({
        where: {
          university_id: universityId,
          media_type: mediaType,
          date: {
            [Op.gte]: moment().utc().subtract(15, 'days').format('YYYY-MM-DD')
          }
        },
        attributes: ['media_id', 'media_type', 'media_metadata', 'play_uri', 'artist_id', 'album_id'], // added play_uri,artist_id,alb
        limit: pagination.limit,
        offset: pagination.offset,
        order: [['count', 'DESC']]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  async fetchChart (universityId, mediaType, pagination) {
    const date = moment().utc().subtract(15, 'days').format('YYYY-MM-DD');
    const rawQuery =
             `select
             "media_id",
             "media_type",
             "media_metadata",
             "play_uri",
             "artist_id",
             "album_id",
             sum("count") as "overall_count"
           from
             "Stream_Stats" as "Stream_Stats"
           where
             "Stream_Stats"."university_id" = ${universityId}
             and "Stream_Stats"."media_type" = ${mediaType}
             and "Stream_Stats"."date" >= '${date}'
           group by
             "media_id",
             "media_type",
             "media_metadata",
             "play_uri",
             "artist_id",
             "album_id"
           order by
             "overall_count" desc
           limit ${pagination.limit} offset ${pagination.offset}`;

    const data = await sequelize.query(rawQuery, {
      type: Sequelize.QueryTypes.SELECT,
      raw: true
      // bind: [params.user_id, params.university_id, params.date, params.app_usage_time, 1]
    })
    return data;
  }

  fetchArtistsChart (universityId, pagination) {
    return new Promise((resolve, reject) => {
      UniversityTrending.findAndCountAll({
        where: {
          university_id: universityId,
          updated_at: {
            [Op.gte]: moment().utc().subtract(30, 'days').format('YYYY-MM-DD')
          }
        },
        limit: pagination.limit,
        offset: pagination.offset
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  async fetchChartCount (universityId, mediaType) {
    const date = moment().utc().subtract(15, 'days').format('YYYY-MM-DD');
    const rawQuery = `select
    count(distinct media_id) 
  from
    "Stream_Stats" as "Stream_Stats"
  where
    "Stream_Stats"."university_id" = ${universityId}
    and "Stream_Stats"."media_type" = ${mediaType}
    and "Stream_Stats"."date" >= '${date}'`;

    const data =  await sequelize.query(rawQuery, {
      type: Sequelize.QueryTypes.SELECT,
      raw: true
    })
    return data;
  }
}

module.exports = ChartService
