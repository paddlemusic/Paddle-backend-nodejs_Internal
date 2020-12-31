const User = require('../models/user')

class UserService {
  signup(params) {
    return new Promise((resolve, reject) => {
      console.log('signup service called')
      console.log("params are:",params)
        User.create(params)
        .then(result => resolve(result))
        .catch(err => reject(err))
      })
  }


  socialMediaSignup(params) {
      return new Promise((resolve, reject) => {
      console.log("params are:",params)
        User.create(params)
        .then(result => resolve(result))
        .catch(err => reject(err))
      })
    }
    

  



  isUserAlreadyExist(params) {
    return new Promise((resolve, reject) => {
        const userAttribute = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'role', 'is_verified']
        User.findOne({ where: params }, { attribute: userAttribute })
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
  }

}

module.exports = UserService
