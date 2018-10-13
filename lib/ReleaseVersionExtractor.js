const VersionExtractor = require('./VersionExtractor')

module.exports = class ReleaseVersionExtractor extends VersionExtractor {
  extractVersionFromRequest (request) {
    return 'release'
  }
}
