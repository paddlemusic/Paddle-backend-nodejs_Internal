const express = require('express')
const router = express.Router()
const AnalyticsController = require('../controllers/analyticsController')
const analyticsController = new AnalyticsController()
router.get('/getTotalStreams', analyticsController.getStreamsTotally)
router.get('/getMonthlyStreams', analyticsController.getStreamsMonthly)
module.exports = router
