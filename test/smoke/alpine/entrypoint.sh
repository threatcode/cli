#!/bin/sh

curl -Lo ./threatcode-cli 'https://static.threatcode.io/cli/latest/threatcode-alpine'
chmod -R +x ./threatcode-cli
mv ./threatcode-cli /usr/local/bin/threatcode
threatcode --version

shellspec -f d
