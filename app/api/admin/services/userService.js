const User = require('../../../models/user')
const University = require('../../../models/university')
// const UserPost = require('../../../models/userPost')
// const StreamStats = require('../../../models/streamStats')
const Sequelize = require('sequelize')
const config = require('../../../config')
const sgMail = require('@sendgrid/mail')
// const constants = require('../../../config/constants')
sgMail.setApiKey(config.SENDGRID.sendgridApiKey)

const Op = Sequelize.Op

class UserService {
  // to be removed later
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

  listUsers (name, universityId, pagination) {
    return new Promise((resolve, reject) => {
      let where = {}
      if (Number(universityId) === 0) {
        where = {
          role: 1,
          name: {
            [Op.iLike]: '%' + name + '%'
          }
        }
      } else {
        where = {
          role: 1,
          name: {
            [Op.iLike]: '%' + name + '%'
          },
          university_id: universityId
        }
      }
      User.findAndCountAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: where,
        attributes: ['name', 'email', 'phone_number', 'is_active', 'id'],
        order: [['id', 'ASC']],
        include: [{
          model: University,
          required: true
          // where: {
          //   name: {
          //     [Op.iLike]: '%' + uniName + '%'
          //   }
          // }
        }]
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

  sendResetLink (toEmail, token, name) {
    return new Promise((resolve, reject) => {
      // --const result = 'http://localhost:4200/auth/reset-password?token=' + token
      const result = config.baseURL + token
      const mailOptions = {
        to: toEmail,
        from: config.SENDGRID.fromEmail,
        subject: 'Password Reset Link',
        // text : 'HI',
        html: `Hi Admin, <br>
       Please <a href = ${result}>click here</a> to reset your password.<br><br>If you did not request this, please ignore this email and your password will remain unchanged.<br><br>Regards,<br>Paddlle Support Team`
      }
      sgMail.send(mailOptions, (err, result) => {
        if (err) {
          console.log('err is', err)
          reject(err)
        } else {
          // console.log(mailOptions)
          resolve(mailOptions)
        }
      })
    })
  }

  updateVerificationToken (params) {
    return new Promise((resolve, reject) => {
      User.is_verified = false
      User.update({ verification_token: params.otp },
        { where: { id: params.id } })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }

  editDetails (params, adminId) {
    return new Promise((resolve, reject) => {
      console.log(params)
      const userAttribute = ['name', 'phone_number', 'profile_picture']
      User.update(params, { where: { id: adminId, role: config.constants.ROLE.ADMIN }, raw: true, attributes: userAttribute })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}
module.exports = UserService
