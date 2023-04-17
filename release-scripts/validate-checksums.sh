#!/usr/bin/env bash
set -euo pipefail

pushd binary-releases
shasum -a 256 -c threatcode-alpine.sha256
shasum -a 256 -c threatcode-linux.sha256
shasum -a 256 -c threatcode-linux-arm64.sha256
shasum -a 256 -c threatcode-macos.sha256
shasum -a 256 -c threatcode-win.exe.sha256
shasum -a 256 -c threatcode-for-docker-desktop-darwin-x64.tar.gz.sha256
shasum -a 256 -c threatcode-for-docker-desktop-darwin-arm64.tar.gz.sha256
shasum -a 256 -c docker-mac-signed-bundle.tar.gz.sha256
shasum -a 256 -c threatcode-fix.tgz.sha256
shasum -a 256 -c threatcode-protect.tgz.sha256
shasum -a 256 -c threatcode.tgz.sha256
gpg --import ../help/_about-this-project/threatcode-code-signing-public.pgp
gpg --verify sha256sums.txt.asc
popd
