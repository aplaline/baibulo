const VersionExtractor = require('./VersionExtractor')

module.exports = class VersionHeaderVersionExtractor extends VersionExtractor {
  extractVersionFromRequest (request) {
    return request.headers && request.headers.version
  }
}
