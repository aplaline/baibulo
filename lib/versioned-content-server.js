var url   = require('url');
var redis = require('./redis-client');

// General options
var options;

function readOptions(opts) {
  opts = opts || { };
  options = {
    redis : opts.redis || process.env["REDIS_URL"] || "redis://localhost:6379",
    prefix: opts.prefix, // defaults to "content:" + req.baseUrl
    index : opts.index || 'index.html'
  };
}

function getRequestVersion(req) {
  return new Promise(function(resolve, reject) {
    // extract version number from Referer header
    var referer = req.header("Referer") ? url.parse(req.header("Referer"), true).query.version : null;
    // get specified version in Referer header or query parameter
    var result = referer || (req.query && req.query.version);
    if (result) {
      resolve(result);
    } else {
      reject();
    }
  });
}

function getDefaultVersionForContext(req, context) {
  return redis.get(context + ":current");
}

function storeRequestVersion(req, version) {
  req.params._frontend_version = version;
}

function getResourceETag(context, path, version) {
  return redis.get(context + path + ":etag:" + version);
}

function storeRequestETag(req, etag) {
  req.params._frontend_etag = etag;
}

function getResourceContentType(context, path, version) {
  return redis.get(context + path + ":content-type:" + version);
}

function storeRequestContentType(req, contentType) {
  req.params._frontend_contentType = contentType;
}

function getVersionedContent(req, res, next) {
  if (req.method != "GET") return next();

  // prepare context
  var context = options.prefix || ("content:" + req.baseUrl);
  // prepare request path with default if not specified
  var path = req.path == "/" ? "/" + options.index : req.path;

  getRequestVersion(req)
    .catch(function() {
      return getDefaultVersionForContext(req, context);
    })
    .then(function(version) {
      storeRequestVersion(req, version);
    })
    .then(function() {
      return getResourceETag(context, path, req.params._frontend_version);
    })
    .then(function(etag) {
      storeRequestETag(req, etag);
    })
    .then(function() {
      return getResourceContentType(context, path, req.params._frontend_version);
    })
    .then(function(contentType) {
      storeRequestContentType(req, contentType);
    })
    .then(function() {
      if (req.headers["if-none-match"] == req.params._frontend_etag) {
        console.log("GET " + context + path + ":" + req.params._frontend_version + " 304 " + req.params._frontend_contentType);
        res.writeHead(304, { "Content-Type": req.params._frontend_contentType, "ETag": req.params._frontend_etag });
        res.end();
      } else {
        console.log("GET " + context + path + ":" + req.params._frontend_version + " 200 " + req.params._frontend_contentType);
        res.writeHead(200, { "Content-Type": req.params._frontend_contentType, "ETag": req.params._frontend_etag });
        return redis.stream(context + path + ":" + req.params._frontend_version, res);
      }
    })
    .catch(function(e) {
      console.log("GET " + context + path + ":" + req.params._frontend_version + " 404");
      res.end("Not found");
    });
}

module.exports = {
  init: function(opts) {
    readOptions(opts);
    redis.init(options.redis);

    return getVersionedContent;
  }
};
