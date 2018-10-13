#!/usr/bin/env node

const app = require('express')()
const baibulo  = require('../')
app.use('*', baibulo())
app.listen(3000)
console.log("Listening for requests on ports 3000, 3001\n");
