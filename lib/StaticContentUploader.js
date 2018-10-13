const url = require('url')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

const CompoundVersionExtractor = require('./CompoundVersionExtractor')
const QueryStringVersionExtractor = require('./QueryStringVersionExtractor')
const VersionHeaderVersionExtractor = require('./VersionHeaderVersionExtractor')

const extractor = new CompoundVersionExtractor([
  new QueryStringVersionExtractor(),
  new VersionHeaderVersionExtractor()
])

module.exports = class StaticContentUploader {
  constructor (root = '/tmp/baibulo') {
    this.root = root
  }

  upload(request, response) {
    return new Promise((resolve, reject) => {
      const version = extractor.extractVersionFromRequest(request)
      if (!version) {
        response.status(400)
        response.end('No version information provided\n')
        reject()
      } else {
        const asset = url.parse(request.originalUrl).pathname
        const filename = `${this.root}${asset}/${version}`

        mkdirp(path.dirname(filename), err => {
          if (err) {
            reject(`Unable to create folder for file ${filename}\n`)
          } else {
            request
              .pipe(fs.createWriteStream(filename))
              .on('finish', () => {
                response.status(201)
                response.end(`Resource ${asset} created in version ${version}\n`)
                resolve(filename)
              })
          }
        })
      }
    })
  }
}
