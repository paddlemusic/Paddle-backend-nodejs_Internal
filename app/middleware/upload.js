
const multer = require('multer')
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '')
  }
})
const upload = multer({ storage }).single('image')
console.log('upload is:', upload)
module.exports = {
  upload: upload
}
