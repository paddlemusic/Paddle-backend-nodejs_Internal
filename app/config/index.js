require('dotenv').config()
const messages = require('../locale/messages')
const constants = require('./constants')
const port = process.env.PORT || 8080

module.exports = {
    DB: {
        'host': process.env.HOST,
        'user': process.env.DB_USER,
        'password': process.env.PASSWORD,
        'port': process.env.DB_PORT,
        'database': process.env.DATABASE,
    },
    JWT: {
        'secret': process.env.JWT_SECRET,
    },
    port: port,
    messages: messages,
    constants: constants
}