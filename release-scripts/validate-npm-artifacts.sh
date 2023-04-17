#!/usr/bin/env bash
set -euo pipefail

releaseTar=$(pwd)/binary-releases/threatcode.tgz

echo 'Creating temp directory for sandbox validation...'
pushd $(mktemp -d)

echo 'Running "npm install binary-releases/threatcode.tgz"...'
npm install $releaseTar

echo 'Validating "threatcode" command succeeds...'
./node_modules/threatcode/bin/threatcode -d

popd
