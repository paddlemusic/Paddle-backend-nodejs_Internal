const https = require('https')
let cachedCountryCallingCode

const getCountryCallingCode = () => {
  let data = ''
  let response
  return new Promise((resolve, reject) => {
    https.get('https://restcountries.eu/rest/v2/all?fields=name;callingCodes;flag', (res) => {
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        data += chunk
      })
      res.on('end', function () {
        try {
          response = JSON.parse(data)
        } catch (e) {
          reject(e)
        }
        resolve(response)
      })
    }).on('error', (e) => {
      reject(e.message)
    }).end()
  })
}

const getCachedCountryCallingCode = async () => {
  if (cachedCountryCallingCode) {
    return cachedCountryCallingCode
  } else {
    let countryCallingCode = await getCountryCallingCode()
    countryCallingCode = countryCallingCode.map(country => {
      return {
        name: country.name,
        callingCode: country.callingCodes[0],
        flag: country.flag
      }
    })
    cachedCountryCallingCode = countryCallingCode
    return countryCallingCode
  }
}

module.exports = { getCachedCountryCallingCode }
