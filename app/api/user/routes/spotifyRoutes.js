const express = require('express')
const router = express.Router()
const SpotifyController = require('../../../controllers/spotifyController')
const spotifyController = new SpotifyController()
const auth = require('../../../middleware/authenticate')

router.put('/saveState', auth.verifyToken, spotifyController.saveSpotifyState)
router.post('/refreshToken', spotifyController.refreshToken)
router.post('/swapToken', spotifyController.swapToken)

module.exports = router
