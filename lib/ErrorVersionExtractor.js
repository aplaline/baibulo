const VersionExtractor = require('./VersionExtractor')

module.exports = class ErrorVersionExtractor extends VersionExtractor {
  extractVersionFromRequest (request) {
    throw new Error('No version information provided')
  }
}
