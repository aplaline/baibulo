var server = require("./lib/versioned-content-server");
var launcher = require("./lib/versioned-content-launcher");

module.exports = function(options) {
  return {
    server: server.init(options),
    launcher: launcher.init(options)
  }
}
