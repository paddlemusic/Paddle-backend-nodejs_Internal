const express = require('express')
const router = express.Router()
const AnalyticsController = require('../controllers/analyticsController')
const analyticsController = new AnalyticsController()

/**
 * @swagger
 *
 * /getTotalShares:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Total Shares For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get share count for album,artist,song for admin panel .
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
router.get('/getTotalSharesLikes', analyticsController.getSharesLikesTotally)

/**
 * @swagger
 *
 * /getMonthlyShares:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Monthly  Shares For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get monthly share count for album,artist,song for admin panel .
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
 *      - in: query
 *        name: month
 *        schema:
 *        type: integer
 *        required: true
 *        description: Month for which the media shares need to be found.
 *      - in: query
 *        name: year
 *        schema:
 *        type: integer
 *        required: true
 *        description: Year for which the media shares need to be found.
 *     produces:
 *       - application/json
 */
router.get('/getMonthlySharesLikes', analyticsController.getSharesLikesMonthly)

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
 * /getMonthlyLikes:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Monthly Likes For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get monthly likes count for album,artist,song for admin panel .
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
 *      - in: query
 *        name: month
 *        schema:
 *        type: integer
 *        required: true
 *        description: Month for which the media likes need to be found.
 *      - in: query
 *        name: year
 *        schema:
 *        type: integer
 *        required: true
 *        description: Year for which the media likes need to be found.
 *     produces:
 *       - application/json
 */
router.get('/getMonthlyLikes', analyticsController.getLikesMonthly)

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
 *        name: university_code
 *        schema:
 *        type: integer
 *        required: true
 *        description: university_id = 0 for all universities streams,university_id >= 1 for specific university stream .
 *     produces:
 *       - application/json
 */
router.get('/getTotalSignups', analyticsController.getAppSignups)

/**
 * @swagger
 *
 * /getMonthlySignups:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Monthly Signups For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get monthly signups count for album,artist,song for admin panel .
 *     parameters:
 *      - in: query
 *        name: university_code
 *        schema:
 *        type: integer
 *        required: true
 *        description: university_id = 0 for all universities streams,university_id >= 1 for specific university stream .
 *      - in: query
 *        name: month
 *        schema:
 *        type: integer
 *        required: true
 *        description: Month for which the app signups need to be found.
 *      - in: query
 *        name: year
 *        schema:
 *        type: integer
 *        required: true
 *        description: Year for which the app signups  need to be found.
 *     produces:
 *       - application/json
 */
router.get('/getMonthlySignups', analyticsController.getAppSignupsMonthly)

/**
 * @swagger
 *
 * /getTotalStreams:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Total Streams For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get stream count for album,artist,song for admin panel .
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

router.get('/getTotalStreams', analyticsController.getstreamsTotally)

/**
 * @swagger
 *
 * /getMonthlyStreams:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Monthly  Streams For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get monthly stream count for album,artist,song for admin panel .
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
 *      - in: query
 *        name: month
 *        schema:
 *        type: integer
 *        required: true
 *        description: Month for which the media shares need to be found.
 *      - in: query
 *        name: year
 *        schema:
 *        type: integer
 *        required: true
 *        description: Year for which the media shares need to be found.
 *     produces:
 *       - application/json
 */
router.get('/getMonthlyStreams', analyticsController.getStreamsMonthly)

module.exports = router
