var url   = require('url');
var redis = require('./redis-client');

// General options
var options;

function readOptions(opts) {
  opts = opts || { };
  options = {
    redis : opts.redis || "redis://localhost:6379",
    prefix: opts.prefix // defaults to "content:" + req.baseUrl
  };
}

function uploadVersionedContent(req, res, next) {
  if (req.method != "PUT") return next();

  // prepare context
  var context = options.prefix || ("content:" + req.baseUrl);
  // prepare request path with default if not specified
  var path = req.path == "/" ? "/" + options.index : req.path;

  var contentType = req.get('Content-Type');
  if (!contentType) {
    res.status(400).send('Missing Content-Type header');
    return;
  }

  var version = req.get('Version');
  if (!version) {
    res.status(400).send('Missing Version header');
    return;
  }

  console.log('PUT ' + path + ':' + version + ' (' + contentType + ')');

  var setContentType = redis.set(context + path + ':content-type:' + version, contentType);
  var setContent = new Promise(function(resolve, reject) {
    req
      .pipe(redis.client().writeStream(context + path + ':' + version, 2147483647))
      .on('finish', resolve)
      .on('error', reject);
  });

  var setETag = redis.set(context + path + ':etag:' + version, Date.now());

  Promise.all([ setContentType, setContent, setETag ]).then(function(result) {
    res.status(201).send(path + ':' + version + ' created\n');
  })
  .catch(function(error) {
    console.log(error)
    res.status(500).send(error);
  })
};

module.exports = {
  init: function(opts) {
    readOptions(opts);
    redis.init(options.redis);

    return uploadVersionedContent;
  }
};
