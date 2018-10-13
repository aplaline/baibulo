const VersionExtractor = require('./VersionExtractor')

module.exports = class QueryStringVersionExtractor extends VersionExtractor {
  extractVersionFromRequest (request) {
    return request.query && request.query.version
  }
}
