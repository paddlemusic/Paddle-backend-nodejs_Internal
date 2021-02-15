const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const userController = new UserController()

const auth = require('../../../middleware/authenticate')

router.post('/login', userController.login)

router.post('/logout', auth.verifyAdminToken, userController.logout)

router.get('/viewProfile', auth.verifyToken, userController.getUserProfiles)

router.get('/userSearch', userController.userSearch)
module.exports = router
