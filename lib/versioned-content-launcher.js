var redis = require('./redis-client');

// General options
var options;

function readOptions(opts) {
  opts = opts || { };
  options = {
    redis : opts.redis || "redis://localhost:6379",
    prefix: opts.prefix, // defaults to "content:" + req.baseUrl
  };
}

function getAllVersions(context) {
  return new Promise(function(resolve, reject) {
    redis.client().keys(context + "/index.html:content-type:*", function(err, keys) {
      if (keys) {
        for (var i = 0; i < keys.length; i++) {
          keys[i] = keys[i].substr(keys[i].lastIndexOf(":") + 1);
        }
        keys.sort();
        keys.reverse();
        resolve(keys);
      } else {
        reject({ code: 500, message: err });
      }
    });
  });
}

function getCurrentVersion(context) {
  return redis.get(context + ":current");
}

function getVersionedContentLauncher(req, res, next) {
  if (req.method != "GET" || req.query.launcher == undefined) return next();

  // prepare context
  var context = options.prefix || ("content:" + req.baseUrl);

  Promise.all([ getAllVersions(context), getCurrentVersion(context) ])
    .then(function(data) {
      var versions = data[0];
      var current  = data[1];
      var response = "";
      response = "<!doctype html><html><body><h1>Versions for context " + req.baseUrl + "</h1><ul>";
      for (var i = 0; i < versions.length; i++) {
        response += "<li><a href='" + req.baseUrl + "?version=" + versions[i] + "'>" + versions[i] + "</a>" + (versions[i] == current ? " (current)" : "") + "</li>";
      }
      response += "</ul></body></html>";
      res.end(response);
    })
    .catch(function(e) {
      res.status(e.code).send(e.message);
    });
}

module.exports = {
  init: function(opts) {
    readOptions(opts);
    redis.init(options.redis);

    return getVersionedContentLauncher;
  }
};
