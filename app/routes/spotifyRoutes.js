const express = require('express')
const router = express.Router()
const SpotifyController = require('../controllers/spotifyController')
const spotifyController = new SpotifyController()
const auth = require('../middleware/authenticate')

router.put('/saveState', auth.verifyToken, spotifyController.saveSpotifyState)
router.get('/refreshToken', auth.verifyToken, spotifyController.refreshToken)
router.get('/swapToken', auth.verifyToken, spotifyController.swapToken)

module.exports = router
