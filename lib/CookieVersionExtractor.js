const VersionExtractor = require('./VersionExtractor')

module.exports = class CookieVersionExtractor extends VersionExtractor {
  extractVersionFromRequest (request) {
    return request.cookies && request.cookies.__version
  }
}
