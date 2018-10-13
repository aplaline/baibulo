const URL = require('url').URL
const VersionExtractor = require('./VersionExtractor')

module.exports = class RefererHeaderVersionExtractor extends VersionExtractor {
  extractVersionFromRequest (request) {
    if (request.headers && request.headers.referer) {
      return new URL(request.headers.referer).searchParams.get('version')
    } else {
      return null
    }
  }
}
