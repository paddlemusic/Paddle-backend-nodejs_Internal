const express = require('express')
const router = express.Router()
const AnalyticsController = require('../controllers/analyticsController')
const analyticsController = new AnalyticsController()

/**
 * @swagger
 *
 * /getstreamStats:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Total & Monthly Streams For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get stream count for album,artist,song for admin panel .
 *     parameters:
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
 *        name: time_span
 *        schema:
 *        type: integer
 *        required: true
 *        description: time_span = 1 for getting total streams,time_span !=1 for monthly stream .
 *      - in: query
 *        name: month
 *        schema:
 *        type: integer
 *        description: Month for which the media stream need to be found.
 *      - in: query
 *        name: year
 *        schema:
 *        type: integer
 *        description: Year for which the media stream need to be found.
 *      - in: query
 *        name: page
 *        schema:
 *        type: integer
 *      - in: query
 *        name: pageSize
 *        schema:
 *        type: integer
 *     produces:
 *       - application/json
 */
router.get('/getstreamStats', analyticsController.getStreamStats)

/**
 * @swagger
 *
 * /getShareLike:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Total & Monthly Shares/likes For Media( all over /Via university).
 *     description: >
 *      This resource will be used to get shares/likes count for album,artist,song for admin panel .
 *     parameters:
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
 *        description: university_id = 0 for all universities share/likes,university_id >= 1 for specific university share/likes .
 *      - in: query
 *        name: time_span
 *        schema:
 *        type: integer
 *        required: true
 *        description: time_span = 1 for getting total share/likes,time_span !=1 for monthly shsare/likes .
 *      - in: query
 *        name: month
 *        schema:
 *        type: integer
 *        description: Month for which the media share/likes need to be found.
 *      - in: query
 *        name: year
 *        schema:
 *        type: integer
 *        description: Year for which the media share/likes need to be found.
 *      - in: query
 *        name: page
 *        schema:
 *        type: integer
 *      - in: query
 *        name: pageSize
 *        schema:
 *        type: integer
 *     produces:
 *       - application/json
 */
router.get('/getShareLike', analyticsController.getSharesLikes)

/**
 * @swagger
 *
 * /getSignups:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Total & Monthly Signups For Users( all over /Via university).
 *     description: >
 *      This resource will be used to get signup count of users for admin panel .
 *     parameters:
 *      - in: query
 *        name: university_id
 *        schema:
 *        type: integer
 *        required: true
 *        description: university_id = 0 for all universities signups,university_id >= 1 for specific university signups .
 *      - in: query
 *        name: time_span
 *        schema:
 *        type: integer
 *        required: true
 *        description: time_span = 1 for getting total signups,time_span !=1 for monthly signups .
 *      - in: query
 *        name: month
 *        schema:
 *        type: integer
 *        description: Month for which the signups need to be found.
 *      - in: query
 *        name: year
 *        schema:
 *        type: integer
 *        description: Year for which the signups need to be found.
 *     produces:
 *       - application/json
 */
router.get('/getSignups', analyticsController.getSignups)

/**
 * @swagger
 *
 * /getAppUsageTime:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get Total & Monthly App_Usage_Time For User_App( all over /Via university).
 *     description: >
 *      This resource will be used to get App_Usage_Time of user_app for admin panel .
 *     parameters:
 *      - in: query
 *        name: university_id
 *        schema:
 *        type: integer
 *        required: true
 *        description: university_id = 0 for all universities App_Usage_Time,university_id >= 1 for specific university App_Usage_Time .
 *      - in: query
 *        name: time_span
 *        schema:
 *        type: integer
 *        required: true
 *        description: time_span = 1 for getting total App_Usage_Time,time_span !=1 for monthly App_Usage_Time .
 *      - in: query
 *        name: month
 *        schema:
 *        type: integer
 *        description: Month for which the App_Usage_Time need to be found.
 *      - in: query
 *        name: year
 *        schema:
 *        type: integer
 *        description: Year for which the App_Usage_Time need to be found.
 *     produces:
 *       - application/json
 */
router.get('/getAppUsageTime', analyticsController.getAppUsageTime)

/**
 * @swagger
 *
 * /getAppOpenData:
 *   get:
 *     tags :
 *      - admin-analytics
 *     summary: Get No. Of Users Openining App at least some time in a day(monthly basis)( all over /Via university).
 *     description: >
 *      This resource will be used to get App_Usage_Time of user_app for admin panel .
 *     parameters:
 *      - in: query
 *        name: university_id
 *        schema:
 *        type: integer
 *        required: true
 *        description: university_id = 0 for all universities AppOpeningUserCount,university_id >= 1 for specific university AppOpeningUserCount .
 *      - in: query
 *        name: open_time
 *        schema:
 *        type: integer
 *        required: true
 *        description: open_time = 1 for getting total AppOpeningUserCount at least once a day,time_span ==2 for getting total AppOpeningUserCount at least twicee a day .
 *      - in: query
 *        name: month
 *        schema:
 *        type: integer
 *        description: Month for which the AppOpeningUserCount to be found.
 *      - in: query
 *        name: year
 *        schema:
 *        type: integer
 *        description: Year for which the AppOpeningUserCount need to be found.
 *     produces:
 *       - application/json
 */
router.get('/getAppOpenData', analyticsController.getAppOpenData)

router.get('/getWeeklyAppOpenData', analyticsController.getWeeklyAppOpenData)

router.get('/userPostDataAnalytics', analyticsController.getAppPostData)

module.exports = router
