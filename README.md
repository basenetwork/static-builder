base.network static builder
========================
http://base.network

Install
-------
``` shell
# download builder sources
git clone https://github.com/basenetwork/static-builder

# download javascript client libraries
git clone https://github.com/basenetwork/client-js
git clone https://github.com/basenetwork/site-engine-js

```

Usage
-----
### From command line
``` shell

# make static file
node static-builder/make.js ../site-engine-js/app-std/main.js > build.js

```

### As web server
``` shell
# start web-server
node static-builder/webserver.js [<port>] [<host>]

```

For example
``` shell
# start local web-server
node static-builder/webserver.js 8080 &

# get build of client lib
curl http://localhost:8080/client.js

# get build of site application engine
curl http://localhost:8080/engine.js

# get build of site core engine
curl http://localhost:8080/core.js

```

