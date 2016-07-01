[![npm version](https://img.shields.io/npm/v/baibulo.svg)](https://www.npmjs.com/package/baibulo)

## Baibulo - versioned static content server and manager

Baibulo (*version* in Chewa) is a versioned static content server and manager package for Node express applications. It is a version of implementation of approach [presented](https://www.youtube.com/watch?v=QZVYP3cPcWQ) on RailsConf 2014 by Luke Melia.

### Usage

Baibulo uses Redis to store and serve the content and metadata so you need to have it installed before getting started. The easiest way to do it is to run it in a Docker container:

```docker run --name redis -d redis```

After that all you need to do is to mount it in your Express application as middleware on some context (as defined in for example Java web applications which is the first part of the path, for example in http://www.testme.org/hello/index.html the **/hello** is the context).

```
var app = require("express")();
var baibulo = require("baibulo")();

app.use("/hello", baibulo.server);

app.listen(3000);
```

To upload stuff to redis you will use the ```baibulo deploy``` command-line utility like so:

```
cd hello
$ baibulo deploy
OK index.html -> content:/hello/index.html:next (text/html)   
OK css/hello.css -> content:/hello/css/hello.css:next (text/css)   
OK js/app.js -> content:/hello/js/app.js:next (application/javascript)   
OK img/logo.png -> content:/hello/img/logo.png:next (image/png)
```

Then you navigate to [http://localhost:3000/hello?version=next](http://localhost:3000/hello?version=next) - done

Every deploy is stored with a different version but if you deploy twice with the same version the previous content is overwritten. This allows to iterate on a future version and once that is complete to switch to the next version like so:

```
$ baibulo deploy --version 2
OK index.html -> content:/hello/index.html:2 (text/html)   
OK css/hello.css -> content:/hello/css/hello.css:2 (text/css)   
OK js/app.js -> content:/hello/js/app.js:2 (application/javascript)   
OK img/logo.png -> content:/hello/img/logo.png:2 (image/png)
$ baibulo set-version --version 2
OK New default version for context '/hello': 2
```

Now you don't need to specify the version anymore so just navigate to [http://localhost:3000/hello](http://localhost:3000/hello) and you're done.

### Configuration

When instantiating bailbulo you will be able to specify some configuration options:

```
    redis  - redis client or uri (default: REDIS_URL environment variable or "redis://localhost:6379")
    prefix - redis key prefix (default: "content:" + context)
    index  - default file to serve when the path does not contain one (default: 'index.html')
    root   - alternative prefix for generated links (default: current server, launcher only)
```

### Listing versions

Sometimes you will want to be able to see all the versions as a list. Baibulo has just the right tool for you to do that! Simply mount the ```baibulo.launcher``` on the same context on a different port and you'll be all set.

```
var express = require("express");
var app1 = express();
var app2 = express();
var baibulo = require("baibulo")({ root: "http://localhost:3000" });

app1.use("/hello", baibulo.server);
app2.use("/hello", baibulo.launcher);

app1.listen(3000);
app2.listen(3001);
```

Now navigate to [http://localhost:3001/hello](http://localhost:3001/hello) and you'll see all your versions listed with links for easy navigation.

### Example

There is a fully implemented [example](https://github.com/testdriven/baibulo/tree/master/example) that you might want to try out in the repository.
