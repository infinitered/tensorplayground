const express = require('express')
const serverless = require('serverless-http')
const app = express()
const router = require('../router')

// Setup lambda function
app.use('/.netlify/functions/server', router) // path must route to lambda

module.exports = app
module.exports.handler = serverless(app)
