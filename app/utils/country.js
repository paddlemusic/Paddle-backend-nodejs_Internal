const https = require('https')
let cachedCountryCallingCode

const getCountryCallingCode = async () => {
  let countries
  const options = {
    hostname: 'restcountries.eu',
    port: 443,
    path: '/v2/all?fields=name;callingCodes',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log('message: ', res.statusMessage)
    res.on('data', d => {
      // process.stdout.write(d)
      countries += d
    })
    res.on('error', d => {
      process.stdout.write(d)
    })
  })
  req.on('error', error => {
    console.error(error)
  })

  // req.write(body)
  req.end()
  return countries.length ? countries : new Error('Unable to fetch')
}

const getCachedCountryCallingCode = async () => {
  if (cachedCountryCallingCode) {
    return cachedCountryCallingCode
  } else {
    let countryCallingCode = await getCountryCallingCode()
    countryCallingCode = countryCallingCode.map(country => {
      return {
        name: country.name,
        callingCode: country.callingCodes[0]
      }
    })
    cachedCountryCallingCode = countryCallingCode
    return countryCallingCode
  }
}

module.exports = { getCachedCountryCallingCode }
