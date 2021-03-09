const express = require('express')
const router = express.Router()
const ChartController = require('../controllers/chartController')
const chartController = new ChartController()
const auth = require('../../../middleware/authenticate')

/**
 * @swagger
 *
 * /addMedia:
 *   post:
 *     tags :
 *      - Chart
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

/**
 * @swagger
 *
 * /getchart/{type}:
 *   get:
 *     tags :
 *      - Chart
 *     summary: Get Charts for Tracks/Artist.
 *     consumes:
 *        - application/json
 *     parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *          type: string
 *          required: true
 *        - in: path
 *          name: type
 *          schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID for track & artist, 1 = track & 2 = artist
 *   description: >
 *    Shows user saved song and artists
 *     produces:
 *       - application/json
 */
router.get('/getchart/:type', auth.verifyToken, chartController.fetchChart)

module.exports = router
