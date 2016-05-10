#!/usr/bin/env node

var vcs = require("../")({ root: "http://localhost:3000" });
var express  = require('express');
var app1     = express();
var app2     = express();

// Enable compression on responses
app1.use(require('compression')());

// Enable file server and file uploader
app1.use("/hello", vcs.server);
app2.use("/hello", vcs.uploader);
app2.use("/hello", vcs.launcher);

// Example backend implementation
app1.get("/api/data", function(req, res) {
  res.json({ message: "Hello, world!" });
});

// Start the server
app1.listen(3000);
app2.listen(3001);

console.log("Listening for requests on ports 3000, 3001\n");
