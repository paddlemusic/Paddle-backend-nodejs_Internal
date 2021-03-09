const express = require('express')
const router = express.Router()
const SongController = require('../controllers/songsController')
const songController = new SongController()

router.get('/getSongs', songController.getSongs)

module.exports = router
