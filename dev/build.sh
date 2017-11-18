#!/bin/bash
#
# install es6-promise & fetch for IE
cp node_modules/es6-promise/dist/es6-promise.auto.min.js site/assets/
cp node_modules/whatwg-fetch/fetch.js site/assets/
#
node dev/site.js
cp -r visual/config.json site/.
