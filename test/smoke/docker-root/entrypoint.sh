#!/bin/sh

set -ex

whoami
npm --version
npm install threatcode -g
threatcode --version
su node -c "threatcode --version"
shellspec -f d
