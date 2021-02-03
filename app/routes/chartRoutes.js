const express = require('express')
const router = express.Router()
const ChartController = require('../controllers/chartController')
const chartController = new ChartController()
const auth = require('../middleware/authenticate')

router.post('/addMedia', auth.verifyToken, chartController.addMedia)
router.get('/get/:type', auth.verifyToken, chartController.fetchChart)

module.exports = router
