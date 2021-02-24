const express = require('express')
const router = express.Router()
const AnalyticsController = require('../controllers/analyticsController')
const analyticsController = new AnalyticsController()
router.get('/getSongsTotalStreams', analyticsController.getSongStreamsTotally)
router.get('/getSongsTotalLikes', analyticsController.getSongLikesTotally)
router.get('/getMonthlyStreams', analyticsController.getStreamsMonthly)
module.exports = router
