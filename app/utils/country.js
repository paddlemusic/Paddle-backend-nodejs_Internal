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
    // countryCallingCode = countryCallingCode.map(country => {
    //   if (country.name && country.callingCodes[0] && country.flag) {
    //     return {
    //       name: country.name,
    //       callingCode: country.callingCodes[0],
    //       flag: country.flag
    //     }
    //   }
    // })
    countryCallingCode = countryCallingCode.reduce((result, country) => {
      if (country.name && country.callingCodes[0] && country.flag && result.indexOf(country)) {
        result.push(
          country.callingCodes[0]
          //{
          // name: country.name,
          //callingCode: country.callingCodes[0],
          // flag: country.flag
        //}
        )
      }
      return [...new Set(result)]
    }, [])
    cachedCountryCallingCode = countryCallingCode
    return countryCallingCode
  }
}

module.exports = { getCachedCountryCallingCode }
