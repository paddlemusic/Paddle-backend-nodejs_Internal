const express = require('express')
const router = express.Router()
const UniversityController = require('../controllers/universityController')
const universityController = new UniversityController()

// const auth = require('../../../middleware/authenticate')

router.get('/getUniversities', universityController.getUniversity)

router.post('/addUniversity', universityController.addUniversity)

router.delete('/deleteUniversity/:id', universityController.deleteUniversity)
module.exports = router
