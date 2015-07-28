#!/usr/bin/env node

process.stdout.write(require("./lib/builder.js").compile(process.argv[2]));
