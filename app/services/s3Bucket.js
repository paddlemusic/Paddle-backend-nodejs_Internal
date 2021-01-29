
const uuid = require('uuid')
const AWS = require('aws-sdk')
const config = require('../config/index')

const s3 = new AWS.S3({
  accessKeyId: config.AWS.id,
  secretAccessKey: config.AWS.secret,
  region: config.AWS.region
})

// Function for uploading the file to S3..
async function uploadToS3 (body) {
  const params = {
    Bucket: config.AWS.bucketName, // pass your bucket name
    Key: `folder/${uuid.v4()}.${body.fileType}`, // file will be saved as testBucket/contacts.csv
    Body: body.buffer,
    ContentType: body.fileType,
    ACL: 'public-read'
  }
  return s3.upload(params).promise()
}

module.exports = {
  uploadToS3
}
