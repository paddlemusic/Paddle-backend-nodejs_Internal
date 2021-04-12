const User = require('../../../models/user')
const University = require('../../../models/university')
// const UserPost = require('../../../models/userPost')
// const StreamStats = require('../../../models/streamStats')
const Sequelize = require('sequelize')
const config = require('../../../config')
const sgMail = require('@sendgrid/mail')
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

  listUsers (name, uniName, pagination) {
    return new Promise((resolve, reject) => {
      User.findAndCountAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: {
          role: 1,
          name: {
            [Op.iLike]: '%' + name + '%'
          }
        },
        
        // attributes: [Sequelize.literal('"User"."name","User"."email","User"."phone_number","User"."is_active","User"."id"')],
        attributes: ['name', 'email', 'phone_number', 'is_active', 'id'],
        // group: ['id'],
        order: [['id', 'ASC']],
        // raw: true,
        include: [{
          model: University,
          required: true,
          where: {
            // role: 1,
            name: {
              [Op.iLike]: '%' + uniName + '%'
            }
          }
          // attributes: ['id', 'name']
          // as: 'post'
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
      // const str = 'Click Here'
      // const result2 = 'https://www.google.com'
      // const result = 'http://localhost:4200/auth/reset-password?token=' + token
      const result = 'http://d293gm0uz2tbzl.cloudfront.net/auth/reset-password?token=' + token
      // const result = 'https://www.google.com' + '/' + 'Token=' + token
      const mailOptions = {
        to:   toEmail,//'shubhamgupta.608@rediffmail.com',
        from: config.SENDGRID.fromEmail,
        subject: 'Password Reset Link',
        // text : 'HI',
        html: `Hi Admin, <br>
       Please <a href = ${result}>click here</a> to reset your password .<br><br> If you did not request this, please ignore this email and your password will remain unchanged.<br><br>Regards,<br>Paddlle Support Team`
      }
      sgMail.send(mailOptions, (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          console.log(mailOptions)
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
