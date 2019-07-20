const express = require('express')
const path = require('path')
const fs = require('fs')

const router = express.Router()

// list of stable snapshots - move this to JSON file
const snapshots = require('./package.json').snapshots

// Depending on import this could be in current path or up a folder
// this function checks for existence in both paths, returns correct one
// this allows us to use the same router for local and netlify
const mister2check = (...checkPath) => {
  const firstCheck = path.join(__dirname, '../', ...checkPath)
  if (fs.existsSync(firstCheck)) return firstCheck
  return path.join(__dirname, ...checkPath)
}

// setup each snapshot build folder
snapshots.map(snapshotName => {
  router.use(`/${snapshotName}/`, express.static(mister2check(snapshotName)))
  router.get(`/${snapshotName}/*`, (_req, res) =>
    res.sendFile(mister2check(snapshotName, 'index.html'))
  )
})

router.get('/', (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write(`<script>top.location.href = "/${snapshots.slice(-1)}"</script>`)
  res.end()
})

module.exports = router
