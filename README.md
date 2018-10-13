# Baibulo - Java implementation

Baibulo (version in Chewa) is a versioned static content server and manager package for Node express applications. It is a version of implementation of approach presented on RailsConf 2014 by Luke Melia.

## Usage

The solution comes in the form of an Express middleware. The following is a basic usage example:

```
const app = require('express')()
const baibulo  = require('../')
app.use(baibulo({ root: '/tmp/baibulo', download: true, upload: true }))
app.listen(3000)
console.log("Listening for requests on ports 3000\n");
```

As you can see there are 3 different parameters that can be adjusted:

`root` - the root folder on the filesystem that all versioned files will be stored in

`download` - a flag that enables download of content.

`upload` - a flag that enables uploading of new content. Setting it to `false` (for example in production) disables the upload thus providing a secure way of serving content to the general public. Nothing stands in the way of having additional server running on an internal IP address that would allow for upload. After all this is just file system that is being used as storage.

The middleware mapping determines what will be the root URL for all content.

## Deployment

The deployment can be done either using cURL or with a dedicated utility called `baibulo-deploy` written as a Node.js package. See https://github.com/aplaline/baibulo-deploy for further information about that utility.

For now let's concentrate on how to deploy a single file in a specific version using cURL.

```
curl -v -X PUT \
  --data-binary "@image.png" \
  -H "Version: TST-1234" \
  http://localhost:8080/hello/assets/image.png
```

Alternatively to the `Version` header you can use the query string parameter named `version` like so:

```
curl -v -X PUT \
  --data-binary "@image.png" \
  http://localhost:8080/hello/assets/image.png?version=TST-1234
```

## Specifying version when uploading assets

When uploading assets Baibulo has a 2 step process that tries to figure out what version should the asset be in:

1. Query string parameter named `version`
2. Header `Version`

If none is specified the upload fails.

## Retrieval rules

When retrieving content Baibulo has 4 stages at which it tries to determine the version which should be served:

1. Query string parameter named `version`
2. Header `Version`
3. Header `Referrer` and its query string parameter `version`
4. Cookie `__version`

If none will be found then the version name `release` will be used.

## Storage options

Baibulo stores the content of static assets in folders with the name of the file and underneeth it there are files with the actual version name. For a simple `index.html` in version TST-1234 (mimicing a Jira ticket number) the structure would look like that:

```
/
 /index.html
   /TST-1234
```

In the future there will be options to store the assets in other storages, such as SQL and NoSQL databases, maybe even in S3 or other cloud storages.
