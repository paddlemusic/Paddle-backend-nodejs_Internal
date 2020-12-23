const User = require('../models/user')

class UserService {
    signup(params) {
        console.log('signup service called')
        // return new Promise((resolve, reject) => {
        //     params.role = 1 // 1->User, 2->Admin
        //     console.log(params)
        //     User.create(params)
        //         .then(result => resolve(result))
        //         .catch(err => reject(err))
        // })
    }
}

module.exports = UserService