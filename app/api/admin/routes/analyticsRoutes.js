const express = require('express')
const router = express.Router()
const AnalyticsController = require('../controllers/analyticsController')
const analyticsController = new AnalyticsController()

/**
 * @swagger
 *
 * /getTotalStreams:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Total Streams For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get streams count for album,artist,song for admin panel .
 *     parameters:
 *      - in: query
 *        name: media_id
 *        schema:
 *        type: string
 *        required: true
 *      - in: query
 *        name: media_type
 *        schema:
 *        type: integer
 *        required: true
 *        description: media_type = 1 for songs,media_type = 2 for artists,media_type = 3 for albums .
 *      - in: query
 *        name: university_id
 *        schema:
 *        type: integer
 *        required: true
 *        description: university_id = 0 for all universities streams,university_id >= 1 for specific university stream .
 *     produces:
 *       - application/json
 */
router.get('/getTotalStreams', analyticsController.getStreamsTotally)

/**
 * @swagger
 *
 * /getTotalLikes:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Total Likes For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get likes count for album,artist,song for admin panel .
 *     parameters:
 *      - in: query
 *        name: media_id
 *        schema:
 *        type: string
 *        required: true
 *      - in: query
 *        name: media_type
 *        schema:
 *        type: integer
 *        required: true
 *        description: media_type = 1 for songs,media_type = 2 for artists,media_type = 3 for albums .
 *      - in: query
 *        name: university_id
 *        schema:
 *        type: integer
 *        required: true
 *        description: university_id = 0 for all universities streams,university_id >= 1 for specific university stream .
 *     produces:
 *       - application/json
 */
router.get('/getTotalLikes', analyticsController.getLikesTotally)

/**
 * @swagger
 *
 * /getTotalSignups:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Total Signups For Users( all over /Via university).
 *     description: >
 *      This resource will be used to get signup count of the users  .
 *     parameters:
 *      - in: query
 *        name: university_id
 *        schema:
 *        type: integer
 *        required: true
 *        description: university_id = 0 for all universities streams,university_id >= 1 for specific university stream .
 *     produces:
 *       - application/json
 */
router.get('/getTotalSignups', analyticsController.getAppSignups)
router.get('/getMonthlyStreams', analyticsController.getStreamsMonthly)
module.exports = router
