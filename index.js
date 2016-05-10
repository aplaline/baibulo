var redis = require("./lib/redis-client");
var server = require("./lib/versioned-content-server");
var uploader = require("./lib/versioned-content-uploader");
var launcher = require("./lib/versioned-content-launcher");

module.exports = function(options) {
  return {
    server: server.init(options),
    uploader: uploader.init(options),
    launcher: launcher.init(options)
  }
}
