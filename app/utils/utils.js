const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const config = require('../config')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.SENDGRID.sendgridApiKey)

const successResponse = (res, successCode, successMessage, data) => {
  res.status(successCode).json({
    status: true,
    status_code: successCode,
    message: successMessage,
    data: data
  })
}

const failureResponse = (res, errorCode, errorMessage) => {
  res.status(errorCode).json({
    status: false,
    status_code: errorCode,
    error: {
      error_code: errorCode,
      message: errorMessage
    }
  })
}

const generateJwtToken = function (payload) {
  return new Promise((resolve, reject) => {
    const secret = config.JWT.secret
    const data = {
      id: payload.id,
      username: payload.username,
      role: payload.role,
      is_active: payload.isActive,
      is_verified: payload.isVerified,
      university_code: payload.universityId
    }
    // console.log('token data is:', data)
    jwt.sign(data, secret, { expiresIn: '30d' }, (err, token) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

const getJwtFromOtp = function (otp) {
  return new Promise((resolve, reject) => {
    const secret = config.JWT.secret
    const data = { otp: otp }
    jwt.sign(data, secret, { expiresIn: '300s' }, (err, token) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log(token)
        resolve(token)
      }
    })
  })
}

const getOtpFromJwt = function (token) {
  return new Promise((resolve, reject) => {
    const secret = config.JWT.secret || ''
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log(err)
        if (err.name === 'TokenExpiredError') {
          resolve({ otp: 'expired' })
        } else {
          reject(err)
        }
      } else {
        console.log(decoded)
        resolve(decoded)
      }
    })
  })
}
const sendEmail = async function (toEmail, name) {
  return new Promise((resolve, reject) => {
    const otp = otpGenerator.generate(4, {
      digits: true, alphabets: false, upperCase: false, specialChars: false
    })
    console.log(otp)
    const mailOptions = {
      to: toEmail,
      from: config.SENDGRID.fromEmail,
      subject: 'Password change request',
      text: `Hi ${name} \n 
      Your password recovery otp is ${otp}. \n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }
    sgMail.send(mailOptions, (err, result) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        mailOptions.otp = otp
        // console.log(mailOptions)
        resolve(mailOptions)
      }
    })
  })
}

/* const sendOTP = async function (phoneNumber) {
  return new Promise((resolve, reject) => {
    const accountSid = config.Twilio.accountSid
    const authToken = config.Twilio.authToken
    const client = require('twilio')(accountSid, authToken)
    const otp = otpGenerator.generate(4, {
      digits: true, alphabets: false, upperCase: false, specialChars: false
    })
    console.log(otp)
    client.messages
      .create({
        body: `Your Paddle verification code is: ${otp}`,
        from: config.Twilio.phoneNumber,
        to: phoneNumber
      })
      .then(message => {
        message.otp = otp
        resolve(message)
      })
      .catch(err => {
        console.log(err)
        resolve()
      })
  })
} */

function encryptPassword (plainTextPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (e, salt) {
      if (e) { reject(e) } else {
        bcrypt.hash(plainTextPassword, salt, function (err, hash) {
          err ? reject(err) : resolve(hash)
        })
      }
    })
  })
}

function comparePassword (plainTextPassword, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainTextPassword, hash, function (err, result) {
      err ? reject(err) : resolve(result)
    })
  })
}
function generatePasswordReset () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, function (err, result) {
      err ? reject(err) : resolve(result.toString('hex'))
    })
  })
}

function generateVerificationToken (payload) {
  return new Promise((resolve, reject) => {
    const secret = config.JWT.secret
    // const data = {
    //   verificationType: payload.verificationType,
    //   isOTPVerified: payload.isOTPVerified
    // }
    jwt.sign(payload, secret, { expiresIn: '300s' }, (err, token) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log(token)
        resolve(token)
      }
    })
  })
}

module.exports = {
  successResponse,
  failureResponse,
  generateJwtToken,
  getJwtFromOtp,
  getOtpFromJwt,
  // sendOTP,
  encryptPassword,
  comparePassword,
  generatePasswordReset,
  sendEmail,
  generateVerificationToken
}
