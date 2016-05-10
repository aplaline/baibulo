var redis = require('redis');

// Enable streaming API on Redis
require('redis-streams')(redis);

var client;

function createRedisClient(config) {
  if (config instanceof redis.RedisClient) {
    client = config;
  } else if (typeof config === "string") {
    client = redis.createClient({ url: config, detect_buffers: true });
  } else if (config instanceof Object) {
    client = redis.createClient(config);
  } else {
    throw new Error("Don't know how to connect to redis with '" + JSON.stringify(config) + "'");
  }
}

function get(key) {
  return new Promise(function(resolve, reject) {
    client.get(key, function(err, value) {
      if (value) {
//        console.log("REDIS: " + key + ": " + value);
        resolve(value);
      } else {
//        console.log("REDIS: " + key + " NOT FOUND");
        reject({ code: 404, message: "Not found", redis: key });
      }
    });
  });
}

function set(key, value) {
  return new Promise(function(resolve, reject) {
//    console.log("REDIS: " + key);
    client.set(key, value, resolve);
  });
}

function stream(key, stream) {
//  console.log("STREAM: " + key);
  return new Promise(function(resolve, reject) {
    client.readStream(key)
      .pipe(stream)
      .on('finish', resolve)
      .on('error', reject);
  });
}

module.exports = {
  init: function(config) {
    createRedisClient(config);
  },
  get: get,
  set: set,
  stream: stream,
  client: function() { return client; }
}
