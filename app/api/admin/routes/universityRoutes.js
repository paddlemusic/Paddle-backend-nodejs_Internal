const express = require('express')
const router = express.Router()
const UniversityController = require('../controllers/universityController')
const universityController = new UniversityController()

// const auth = require('../../../middleware/authenticate')

/**
 * @swagger
 *
 * /getUniversities:
 *   get:
 *     tags :
 *      - admin-university
 *     summary: Get Universities.
 *     description: >
 *      This resource will be used to get all the universities exist .
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
 *     produces:
 *       - application/json
 */
router.get('/getUniversities', universityController.getUniversity)

/**
 * @swagger
 *
 * /addUniversity:
 *   post:
 *     tags:
 *      - admin-university
 *     summary: Add University.
 *     description: >
 *      This resource will be used for adding universities from admin panel.
 *     parameters:
 *      - in: body
 *        name: name
 *        schema:
 *        type: string
 *        required: true
 *      - in: body
 *        name: city
 *        schema:
 *        type: string
 *        required: false
 *     produces:
 *       - application/json
 */
router.post('/addUniversity', universityController.addUniversity)

/**
 * @swagger
 *
 * /deleteUniversity/{id}:
 *   delete:
 *     tags:
 *      - admin-university
 *     summary: Delete University.
 *     description: >
 *      This resource will be used for deleting universities from admin panel.
 *     parameters:
 *      - in: params
 *        name: id
 *        schema:
 *        type: integer
 *        required: true
 *     produces:
 *       - application/json
 */
router.delete('/deleteUniversity/:id', universityController.deleteUniversity)

/**
 * @swagger
 *
 * /{id}/status/toggle:
 *   put:
 *     tags:
 *      - admin-university
 *     summary: Toggle University status.
 *     description: >
 *      This resource will be used for toggle universities status from admin panel.
 *     parameters:
 *      - in: params
 *        name: id
 *        schema:
 *        type: integer
 *        required: true
 *     responses:
 *          default:
 *              description: Get list of niversities response object.
 */
router.put('/:id/status/toggle', universityController.toggleUniversityStatus)

/**
 * @swagger
 *
 * /universitySearch:
 *   get:
 *     tags :
 *      - admin-university
 *     summary: T0 search university through name.
 *     description: >
 *      This resource will be used to search university on the basis of name in search bar .
 *     parameters:
 *      - in: query
 *        name: name
 *        schema:
 *        type: string
 *        required: true
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
 *     produces:
 *       - application/json
 */
router.get('/universitySearch', universityController.universitySearch)

/**
 * @swagger
 *
 * /editUniversity/{id}:
 *   post:
 *     tags :
 *      - admin-university
 *     summary: For editing university details from admin panel.
 *     description: >
 *      This resource will be used to edit details of universities from admin panel.
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *            type: integer
 *        required: true
 *        description: Id of the university to be edited
 *      - in: body
 *        name: name
 *        schema:
 *            type: string
 *        required: false
 *     produces:
 *       - application/json
 */
router.post('/editUniversity/:id', universityController.editUniversity)

/**
 * @swagger
 *
 * /viewUniversity/{id}:
 *   get:
 *     tags :
 *      - admin-university
 *     summary: For Viewing university detail.
 *     description: >
 *      This resource will be used to get details of university from admin panel.
 *     parameters:
 *      - in: params
 *        name: id
 *        schema:
 *            type: integer
 *        required: true
 *     produces:
 *       - application/json
 */
router.get('/viewUniversity/:id', universityController.getUniversityDetail)
module.exports = router
