const express = require('express')
const router = express.Router()
const SongController = require('../controllers/songsController')
const songController = new SongController()

/**
 * @swagger
 *
 * /getSongs:
 *   get:
 *     tags :
 *      - admin-songs
 *     summary: Get Songs.
 *     description: >
 *      This resource will be used to get all the songs exist .
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *        type: integer
 *        required: false
 *      - in: query
 *        name: pageSize
 *        schema:
 *        type: integer
 *        required: false
 *      - in: query
 *        name: name
 *        schema:
 *        type: integer
 *        required: false
 *        description: name query to be null to get all songs else will search on the basis of name query
 *     produces:
 *       - application/json
 */
router.get('/getSongs', songController.getSongs)

module.exports = router
