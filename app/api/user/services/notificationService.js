const admin = require('firebase-admin')
const serviceAccount = require('../../../../googleServiceAccountKeys.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https:/paddle-300111.firebaseio.com'
})

async function sendNotification (deviceTokens, message) {
  // console.log('from notification service', deviceTokens)
  const tokens = []
  deviceTokens.forEach((token) => {
    if (token.device_token) {
      tokens.push(token.device_token)
    }
  })
  console.log(tokens)

  message.tokens = tokens
  console.log(message)

  try {
    const response = await admin.messaging().sendMulticast(message)
    console.log('Success Count:  ' + JSON.stringify(response))
    return response.successCount
  } catch (err) {
    console.log(err)
    return 0
  }
}

module.exports = {
  sendNotification
}
