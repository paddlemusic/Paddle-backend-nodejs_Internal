// import firebase from 'firebase/app'
const FirebaseApp = require('firebase/app')
const FirebaseMessaging = require('firebase/messaging')
const config = require('../config')

function getToken () {
  return new Promise((resolve, reject) => {
    const messaging = FirebaseApp.messaging()
    const vapidKey = config.FIREBASE.vapidKey
    messaging.getToken(vapidKey, function (err, result) {
      err ? reject(err) : resolve(result)
    })
  })
}

module.exports = {
  getToken
}
