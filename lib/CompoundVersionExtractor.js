const VersionExtractor = require('./VersionExtractor')

module.exports = class CompoundVersionExtractor extends VersionExtractor {
  constructor (extractors) {
    super()
    this.extractors = extractors
  }

  extractVersionFromRequest (request) {
    for (let i = 0; i < this.extractors.length; i++) {
      const version = this.extractors[i].extractVersionFromRequest(request)
      if (version) return version
    }
    return null
  }
}

