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
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  resetPassword (params) {
    return new Promise((resolve, reject) => {
      User.update({ password: params.newPassword, resetPasswordToken: null, resetPasswordExpires: null },
        { where: { resetPasswordToken: params.getResetPasswordToken, resetPasswordExpires: { [Op.gt]: Date.now() } } })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  sendResetLink (toEmail, name) {
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
  }

  getSharesPerUniversity (mediaId, universityId) {
    // console.log('ffffffffffff', follwersId, sharedWith)
    return new Promise((resolve, reject) => {
      UserPost.findAndCountAll({
        where: { media_id: mediaId, media_type: 1 },
        // attributes: [Sequelize.literal(`"User_Post"."id","user_id","name","profile_picture","media_id","caption","shared_with",
        // "media_image","media_name","meta_data","media_id","caption"`)],
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

/*  getTotalMonthlyShares (mediaId, month) {
    // console.log('ffffffffffff', follwersId, sharedWith)
    return new Promise((resolve, reject) => {
      UserPost.findAndCountAll({
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.cast(Sequelize.col('created_at'), 'integer')), month),
            { media_id: mediaId, media_type: 1 }
          ]
        },
        // attributes: [Sequelize.literal(`"User_Post"."id","user_id","name","profile_picture","media_id","caption","shared_with",
        // "media_image","media_name","meta_data","media_id","caption"`)],
        raw: true
      }).then(result => resolve(result))
        .catch(err => reject(err))
    })
  } */
}
module.exports = UserService
