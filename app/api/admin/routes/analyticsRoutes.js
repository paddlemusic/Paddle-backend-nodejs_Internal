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

module.exports = router
