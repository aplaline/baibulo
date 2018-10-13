const url = require('url')
const fs = require('fs')
const path = require('path')
const mime = require('mime')

const CompoundVersionExtractor = require('./CompoundVersionExtractor')
const CookieVersionExtractor = require('./CookieVersionExtractor')
const QueryStringVersionExtractor = require('./QueryStringVersionExtractor')
const VersionHeaderVersionExtractor = require('./VersionHeaderVersionExtractor')
const RefererHeaderVersionExtractor = require('./RefererHeaderVersionExtractor')
const ReleaseVersionExtractor = require('./ReleaseVersionExtractor')

const extractor = new CompoundVersionExtractor([
  new QueryStringVersionExtractor(),
  new VersionHeaderVersionExtractor(),
  new RefererHeaderVersionExtractor(),
  new CookieVersionExtractor(),
  new ReleaseVersionExtractor()
])

module.exports = class StaticContentRetriever {
  constructor (root = '/tmp/baibulo') {
    this.root = root
  }

  retrieve(request, response) {
    const version = extractor.extractVersionFromRequest(request)
    const pathname = url.parse(request.originalUrl).pathname
    const asset = pathname == '/' ? '/index.html' : pathname
    const filename = `${this.root}${asset}/${version}`
    const mimetype = mime.getType(path.extname(asset))

    return new Promise((resolve, reject) => {
      fs.stat(filename, (err, stat) => {
        if (err == null) {
          response.setHeader('Content-length', stat.size)
          response.setHeader('Content-Type', mimetype)
          fs.createReadStream(filename).pipe(response).on('end', () => resolve(filename))
        } else {
          reject()
        }
      })
    })
  }
}
