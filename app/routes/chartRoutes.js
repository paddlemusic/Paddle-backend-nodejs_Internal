const express = require('express')
const router = express.Router()
const ChartController = require('../controllers/chartController')
const chartController = new ChartController()
const auth = require('../middleware/authenticate')

/**
 * @swagger
 *
 * /addMedia:
 *   post:
 *     tags :
 *      - chart
 *     summary: To Add Media.
 *     consumes:
 *        - application/json
 *     parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *          type: string
 *          required: true
 *        - in: body
 *          name: data
 *          description: Tracks Or Artists Data.
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *               track:
 *                 type: object
 *                 properties:
 *                    media_id:
 *                     type: string
 *                     required: true
 *                    media_type:
 *                     type: integer
 *                     required: true
 *                    media_metadata:
 *                      type: object
 *                      properties:
 *                         name:
 *                          type: string
 *                         image:
 *                           type: string
 *               artist:
 *                 type: object
 *                 properties:
 *                    media_id:
 *                     type: string
 *                     required: true
 *                    media_type:
 *                     type: integer
 *                     required: true
 *                    media_metadata:
 *                      type: object
 *                      properties:
 *                         name:
 *                          type: string
 *                         image:
 *                           type: string
 *     produces:
 *       - application/json
 */

router.post('/addMedia', auth.verifyToken, chartController.addMedia)

router.get('/getchart/:type', auth.verifyToken, chartController.fetchChart)

module.exports = router
