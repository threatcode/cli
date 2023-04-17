#!/usr/bin/env bash
set -euo pipefail

OUTPUT_FILE="binary-releases/release.json"

cp ./release-scripts/release.json "${OUTPUT_FILE}"

if [[ $(uname -s) == "Darwin" ]];then
    echo "this is Mac"
    sed -i "" "s|1.0.0-monorepo|$(cat binary-releases/version)|g" "${OUTPUT_FILE}"
    sed -i "" "s|threatcode-alpine-sha256|$(cat binary-releases/threatcode-alpine.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|threatcode-linux-sha256|$(cat binary-releases/threatcode-linux.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|threatcode-linux-arm64-sha256|$(cat binary-releases/threatcode-linux-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|threatcode-macos-sha256|$(cat binary-releases/threatcode-macos.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|threatcode-win.exe-sha256|$(cat binary-releases/threatcode-win.exe.sha256)|" "${OUTPUT_FILE}"
else
    echo "this is Linux"
    sed -i "s|1.0.0-monorepo|$(cat binary-releases/version)|g" "${OUTPUT_FILE}"
    sed -i "s|threatcode-alpine-sha256|$(cat binary-releases/threatcode-alpine.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|threatcode-linux-sha256|$(cat binary-releases/threatcode-linux.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|threatcode-linux-arm64-sha256|$(cat binary-releases/threatcode-linux-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|threatcode-macos-sha256|$(cat binary-releases/threatcode-macos.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|threatcode-win.exe-sha256|$(cat binary-releases/threatcode-win.exe.sha256)|" "${OUTPUT_FILE}"
fi

# sanity check if release.json is a valid JSON
jq '.' "${OUTPUT_FILE}"
