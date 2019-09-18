const StaticContentRetriever = require('./lib/StaticContentRetriever')
const StaticContentUploader = require('./lib/StaticContentUploader')

function baibulo({ root = '/tmp/baibulo', download = true, upload = true } = {}) {
  const retriever = new StaticContentRetriever(root)
  const uploader = new StaticContentUploader(root)

  return (request, response, next) => {
    if (download && request.method === 'GET') {
      retriever.retrieve(request, response).catch(next)
    } else if (upload && request.method === 'PUT' || request.method === 'POST') {
      uploader.upload(request, response).catch(next)
    } else {
      next()
    }
  }
}

module.exports = baibulo
