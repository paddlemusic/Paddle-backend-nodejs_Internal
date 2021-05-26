const User = require('../../../models/user')
// const UserFollower = require('../models/userFollower')
// const UserMedia = require('../models/userMedia')
const LikePost = require('../../../models/likePost')
const UserPost = require('../../../models/userPost')
const PostShare = require('../../../models/userPostShare')
const sequelize = require('../../../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')
// const CommonService = require('./commonService')
// const commonService = new CommonService()

// const UserService = require('./userService')
// const userService = new UserService()

class HomeService {
  getUserPostOld (followingId, userId, pagination) {
    console.log('ffffffffffff', followingId, userId)
    return new Promise((resolve, reject) => {
      PostShare.findAndCountAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: {
          [Op.and]: { shared_by: followingId },
          [Op.or]: [
            { shared_with: userId },
            { shared_with: null }
          ],
          created_at: {
            [Op.gte]: moment().subtract(5, 'days').toDate()
          }
        },
        order: [
          ['created_at', 'DESC']
        ],
        //,
        attributes: [Sequelize.literal(`"User_Post"."id","user_id","name","profile_picture","media_id","caption","shared_with",
        "media_image","media_name","meta_data","meta_data2","media_type","caption", "like_count","play_uri","artist_id","album_id", album_name`)], // in response added playURI,artist_id,album_id
        raw: true,
        include: [{
          model: User,
          required: true,
          attributes: []
          // as: 'post'
        }, {
          model: UserPost,
          required: true,
          attributes: []
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getUserPost (followingId, userId, pagination) {
    console.log('ffffffffffff', followingId, userId)
    return new Promise((resolve, reject) => {
      PostShare.findAndCountAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: {
          [Op.and]: { [Op.or]: [ { shared_by: followingId }, { shared_with: userId } ], created_at: {
            [Op.gte]: moment().subtract(5, 'days').toDate()
          }},
        },
        order: [
          ['created_at', 'DESC']
        ],
        //,
        attributes: [Sequelize.literal(`"User_Post"."id","user_id","name","profile_picture","media_id","caption","shared_with",
        "media_image","media_name","meta_data","meta_data2","media_type","caption", "like_count","play_uri","artist_id","album_id", album_name`)], // in response added playURI,artist_id,album_id
        raw: true,
        include: [{
          model: User,
          required: true,
          attributes: []
          // as: 'post'
        }, {
          model: UserPost,
          required: true,
          attributes: []
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getAPost (postId) {
    return new Promise((resolve, reject) => {
      PostShare.findOne({
        where: {
          post_id: postId
        },
        attributes: [Sequelize.literal(`"User_Post"."id","user_id","name","profile_picture","media_id","caption","shared_with",
        "media_image","media_name","meta_data","meta_data2","media_type","caption", "like_count","play_uri","artist_id","album_id"`)], // in response added playURI,artist_id,album_id
        raw: true,
        include: [{
          model: User,
          required: true,
          attributes: []
        }, {
          model: UserPost,
          required: true,
          attributes: []
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getUserPostOldMethod (followingId, userId, pagination) {
    console.log('ffffffffffff', followingId, userId)
    return new Promise((resolve, reject) => {
      UserPost.findAndCountAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: {
          [Op.and]: { user_id: followingId },
          [Op.or]: [
            { shared_with: userId },
            { shared_with: null }
          ],
          updated_at: {
            [Op.gte]: moment().subtract(5, 'days').toDate()
          }
        },
        order: [
          ['created_at', 'DESC']
        ],
        //,
        attributes: [Sequelize.literal(`"User_Post"."id","user_id","name","profile_picture","media_id","caption","shared_with",
        "media_image","media_name","meta_data","meta_data2","media_type","caption", "like_count","play_uri","artist_id","album_id"`)], // in response added playURI,artist_id,album_id
        raw: true,
        include: [{
          model: User,
          required: true,
          attributes: []
          // as: 'post'
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  /*  async getHomePosts (userId, followingIds, pagination) {
    // try {
    const rawQuery =
              `SELECT
              COUNT(up.id) OVER(),
              up.id ,
              up.media_id ,
              up.media_name ,
              up.media_image ,
              up.media_type ,
              up.meta_data ,
              up.meta_data2 ,
              up.user_id ,
              up.caption ,
              up.shared_with ,
              up.created_at ,
              up.updated_at ,
              u."name" ,
              u.profile_picture ,
              COUNT(lp.user_id) as like_count
            FROM
              "User_Post" up
            INNER JOIN "User" u ON
              u.id = up.user_id
            LEFT JOIN "Like_Post" lp ON
              lp.post_id = up.id
            WHERE
              up.user_id IN (${followingIds})
              AND (up.shared_with = ${userId}
                OR up.shared_with IS NULL)
              AND up.created_at >= NOW() - INTERVAL '5' DAY
            GROUP BY
              up.id ,
              u."name" ,
              u.profile_picture
            ORDER BY
              up.created_at DESC
            LIMIT ${pagination.limit}
            OFFSET ${pagination.offset}
            `
    const data = await sequelize.query(rawQuery, {
      // raw: true
    })
    return data
    // } catch (error) {
    //   // logger.error(error)
    //   throw error
    // }
  } */

  getUserPostLike (postId) {
    return new Promise((resolve, reject) => {
      LikePost.findAll({
        // limit: pagination.limit,
        // offset: pagination.offset,
        where: {
          post_id: postId
        },
        // order: [
        //   ['created_at', 'DESC']
        // ],
        //,
        // attributes: [Sequelize.literal(`"User_Post"."id","user_id","name","profile_picture","media_id","caption","shared_with",
        // "media_image","media_name","meta_data","meta_data2","media_type","caption"`)],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  async likePost (params) {
    // return new Promise((resolve, reject) => {
    //   sequelize.transaction(async t => {
    //     LikePost.findOrCreate({ where: params, transaction: t })
    //       .then((result) => {
    //         if (result[1]) {
    //           return UserPost.findOne({ where: { id: params.post_id }, transaction: t })
    //             .then(findResult => { return findResult.increment('like_count', { transaction: t }) })
    //         }
    //       }).then(result => resolve(result))
    //       .catch(err => reject(err))
    //   })
    // })
    // try {
    await sequelize.transaction(async (t) => {
      const likePostResult = await LikePost.findOrCreate({ where: params, transaction: t })
      if (likePostResult[1]) {
        const findUserPostResult = await UserPost.findOne({ where: { id: params.post_id }, transaction: t })
        await findUserPostResult.increment('like_count', { transaction: t })
      }
      return likePostResult[0]
    })
    // } catch (error) {
    //   throw error
    // }
  }

  async unlikePost (params) {
    // return new Promise((resolve, reject) => {
    //   LikePost.destroy({ where: params })
    //     .then(result => {
    //       console.log(result)
    //       if (result) {
    //         return UserPost.findOne({ where: { id: params.post_id } })
    //           .then(findResult => { return findResult.decrement('like_count') })
    //       }
    //     }).then(result => resolve(result))
    //     .catch(err => reject(err))
    // })
    await sequelize.transaction(async (t) => {
      const likePostResult = await LikePost.destroy({ where: params, transaction: t })
      if (likePostResult) {
        const findUserPostResult = await UserPost.findOne({ where: { id: params.post_id }, transaction: t })
        await findUserPostResult.decrement('like_count', { transaction: t })
      }
      return likePostResult
    })
  }

  // getUsersByName (username) {
  //   console.log('username is:', username)
  //   return new Promise((resolve, reject) => {
  //     User.findAndCountAll({
  //       where: {
  //         name: {
  //           [Op.iLike]: '%' + username + '%'
  //         }
  //       },
  //       attributes: ['id', 'name', 'profile_picture'],
  //       raw: true
  //     }).then(result => resolve(result))
  //       .catch(err => reject(err))
  //   })
  // }
}

module.exports = HomeService
