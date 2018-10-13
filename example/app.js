#!/usr/bin/env node

const app = require('express')()
const baibulo  = require('../')

app.use(baibulo({ root: '/tmp/baibulo', download: true, upload: true }))

app.get('/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end('{ "message": "Hello, world!" }')
})

app.listen(3000)
console.log("Listening for requests on ports 3000\n");
