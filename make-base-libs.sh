#!/usr/bin/env bash

# core client lib
#./make.js ../client-js/lib/core.js            >../client-js/core-1.0.js
./make.js ../client-js/lib/core.js            >../node-server/data/core.js

# site app std
./make.js ../site-engine-js/app-std/main.css  >../site-engine-js/app-std-1.0.css
./make.js ../site-engine-js/app-std/main.js   >../site-engine-js/app-std-1.0.js

# site app core
./make.js ../site-engine-js/app-core/main.css >../site-engine-js/app-core-1.0.css
./make.js ../site-engine-js/app-core/main.js  >../site-engine-js/app-core-1.0.js
