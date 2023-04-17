#!/usr/bin/env bash
set -euo pipefail

declare -a StaticFiles=(
  "binary-releases/threatcode-alpine"
  "binary-releases/threatcode-linux"
  "binary-releases/threatcode-linux-arm64"
  "binary-releases/threatcode-macos"
  "binary-releases/threatcode-win.exe"
  "binary-releases/threatcode-for-docker-desktop-darwin-x64.tar.gz"
  "binary-releases/threatcode-for-docker-desktop-darwin-arm64.tar.gz"
  "binary-releases/docker-mac-signed-bundle.tar.gz"
  "binary-releases/threatcode-alpine.sha256"
  "binary-releases/threatcode-linux.sha256"
  "binary-releases/threatcode-linux-arm64.sha256"
  "binary-releases/threatcode-macos.sha256"
  "binary-releases/threatcode-win.exe.sha256"
  "binary-releases/threatcode-for-docker-desktop-darwin-x64.tar.gz.sha256"
  "binary-releases/threatcode-for-docker-desktop-darwin-arm64.tar.gz.sha256"
  "binary-releases/docker-mac-signed-bundle.tar.gz.sha256"
  "binary-releases/sha256sums.txt.asc"
)

VERSION_TAG="v$(cat binary-releases/version)"

if [ ${#} == 0 ]; then
  echo "No upload target defined!"
  exit 1
fi

for arg in "${@}"; do
   target="${arg}"
    if [ "${arg}" == "version" ]; then
      target="${VERSION_TAG}"
    fi
    echo "Uploading to ${target}"

  # Upload files to the GitHub release
  if [ "${arg}" == "github" ]; then
    gh release create "${VERSION_TAG}" "${StaticFiles[@]}" \
      --target "${CIRCLE_SHA1}" \
      --title "${VERSION_TAG}" \
      --notes-file binary-releases/RELEASE_NOTES.md

  # Upload files to npm
  elif [ "${arg}" == "npm" ]; then
    npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
    npm publish ./binary-releases/threatcode-fix.tgz
	  npm publish ./binary-releases/threatcode-protect.tgz
	  npm publish ./binary-releases/threatcode.tgz
  
  # Upload files to S3 bucket
  else
    for filename in "${StaticFiles[@]}"; do
      aws s3 cp "${filename}" s3://"${PUBLIC_S3_BUCKET}"/cli/"${target}"/
    done

    aws s3 cp "binary-releases/release.json" s3://"${PUBLIC_S3_BUCKET}"/cli/"${target}"/
    aws s3 cp "binary-releases/version" s3://"${PUBLIC_S3_BUCKET}"/cli/"${target}"/
  fi  
done
