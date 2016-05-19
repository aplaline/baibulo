var mime = require("mime");
var path = require("path");
var fs = require("fs");

var emptyLogger = function(file, resource, version, contentType) { }

module.exports = function deployFiles(redis, absolutePath, prefix, context, version, files, log) {
  log = log || emptyLogger;
  return Promise.all(files.map(function(file) {
    var absoluteFile = path.resolve(file);
    var resource = absoluteFile.substr(absolutePath.length + 1);
    var contentType = mime.lookup(file);

    var setETag = redis.set(prefix + context + resource + ':etag:' + version, Date.now());
    var setContentType = redis.set(prefix + context + resource + ':content-type:' + version, contentType);
    var setContent = new Promise(function(resolve, reject) {
      fs.createReadStream(file)
        .pipe(redis.client().writeStream(prefix + context + resource + ':' + version, 2147483647))
        .on('finish', resolve)
        .on('error', reject);
    });

    return Promise.all([ setContentType, setContent, setETag ]).then(function(result) {
      log(file, prefix + context + resource, version, contentType, result);
    });
  }));
}
