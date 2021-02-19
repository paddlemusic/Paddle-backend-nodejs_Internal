const User = require('../../../models/user')
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

  listUsers (pagination) {
    return new Promise((resolve, reject) => {
      User.findAll({
        limit: pagination.limit,
        offset: pagination.offset,
        where: {
          role: 1
        },
        attributes: ['name', 'email', 'phone_number', 'is_active'],
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
}
module.exports = UserService
