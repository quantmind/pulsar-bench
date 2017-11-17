#!/bin/bash

# assets directory
rm -rf site/assets
mkdir -p site/assets

#
# install es6-promise & fetch for IE
cp node_modules/es6-promise/dist/es6-promise.auto.min.js site/assets/
cp node_modules/whatwg-fetch/fetch.js site/assets/
#
node visual/site.js
cp -r visual/config.json site/.
# copy circle.yml
cp circle.yml site/.
