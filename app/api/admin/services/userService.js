const User = require('../../../models/user')
const UserPost = require('../../../models/userPost')
const Sequelize = require('sequelize')
const config = require('../../../config')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.SENDGRID.sendgridApiKey)

const Op = Sequelize.Op

class UserService {
  getUsers (name, pagination) {
    return new Promise((resolve, reject) => {
      User.findAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: {
          name: {
            [Op.iLike]: '%' + name + '%'
          }
        },
        //        order: [
        //         ['created_at', 'DESC']
        //       ],
        attributes: [],
        raw: true
        // result.likes=likes
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  listUsers (name, pagination) {
    return new Promise((resolve, reject) => {
      User.findAndCountAll({
        where: {
          role: 1,
          name: {
            [Op.iLike]: '%' + name + '%'
          }
        },
        limit: pagination.limit,
        offset: pagination.offset,
        attributes: ['name', 'email', 'phone_number', 'is_active', 'id'],
        // group: ['id'],
        order: [['id', 'ASC']],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  /* resetPassword (params) {
    return new Promise((resolve, reject) => {
      User.update({ password: params.newPassword, resetPasswordToken: null, resetPasswordExpires: null },
        { where: { resetPasswordToken: params.getResetPasswordToken, resetPasswordExpires: { [Op.gt]: Date.now() } } })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  } */

  /*  sendResetLink (toEmail, name) {
    return new Promise((resolve, reject) => {
      const str = 'Click Here'
      const result = str.link('https://www.google.com')
      const mailOptions = {
        to: 'eresh.sharma@algoworks.com',
        from: config.SENDGRID.fromEmail,
        subject: 'Password reset link',
        text: `Hi ${name} \n
        ${result} to reset your password :\n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
      }
      sgMail.send(mailOptions, (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          // console.log(mailOptions)
          resolve(mailOptions)
        }
      })
    })
  } */

  editDetails (params, adminId) {
    return new Promise((resolve, reject) => {
      console.log(params)
      const userAttribute = ['name', 'phone_number', 'profile_picture']
      User.update(params, { where: { id: adminId, role: 2 }, raw: true, attributes: userAttribute })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getSharesPerUniversity (mediaId, universityId, mediaType) {
    return new Promise((resolve, reject) => {
      UserPost.findAndCountAll({
        where: { media_id: mediaId, media_type: mediaType },
        raw: true,
        include: [{
          model: User,
          required: true,
          where: { university_code: universityId },
          attributes: []
          // as: 'post'
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getLikesPerUniversity (mediaId, universityId, mediaType) {
    return new Promise((resolve, reject) => {
      UserPost.findAll({
        where: { media_id: mediaId, media_type: mediaType },
        // attributes: [Sequelize.literal('"User_Post"."id"')],
        attributes: [Sequelize.fn('sum', Sequelize.col('"User_Post"."like_count"'))],
        // attributes: [Sequelize.literal([Sequelize.fn('sum', Sequelize.col('User_Post.id'))])],
        raw: true,
        include: [{
          model: User,
          required: true,
          where: { university_code: universityId },
          attributes: []
          // as: 'post'
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getTotalMonthlyShares (mediaId, mediaType, month) {
    // console.log('ffffffffffff')
    return new Promise((resolve, reject) => {
      UserPost.findAll({
        // attributes: [Sequelize.fn('sum', Sequelize.col('"User_Post"."id"'))],
        /*    attributes: {
          include: [
            [Sequelize.fn('sum', Sequelize.col('like_count'))]
          ]
        }, */
        // where: ([Sequelize.fn('extract(month)', Sequelize.col('created_at'))], month),
        // where: { media_id: mediaId, media_type: mediaType },
        where: {
          [Op.and]: [

            // Sequelize.where([Sequelize.fn('extract', ['MONTH', 'FROM'], Sequelize.col('created_at'))], month),
            { media_id: mediaId, media_type: mediaType }
          ]
        },
        // [Op.and]: [
        // console.log('fffff'),
        // equelize.where([SequeSlize.fn('extract(month)', Sequelize.col('created_at'))], month)
        // Sequelize.where(media_id:mediaId),
        // { media_id: mediaId, media_type: mediaType }
        // ],
        // group: ['created_at', 'id'],
        // order: [['created_at', 'DESC']],
        // limit: 2,
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  getUniversityMonthlyShares (mediaId, universityId) {
    return new Promise((resolve, reject) => {
      UserPost.findAndCountAll({
        where: { media_id: mediaId, media_type: 1 },
        group: ['User_post"."created_at"', '"User_Post"."id"'],
        order: [['"User_post"."created_at"', 'DESC']],
        limit: 1,
        raw: true,
        include: [{
          model: User,
          required: true,
          where: { university_code: universityId },
          attributes: []
          // as: 'post'
        }]
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
module.exports = UserService
