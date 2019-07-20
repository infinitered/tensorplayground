const express = require('express')
const app = express()
const router = require('./router')

app.use('/', router)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Local app listening on port ${port}!`))