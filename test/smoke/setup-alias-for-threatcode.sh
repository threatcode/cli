#!/usr/bin/env bash
set -e

# Force CI to have this built Threatcode version available in shell used
echo "node ${PWD}/bin/threatcode \"\$@\"" > /usr/local/bin/threatcode
chmod +x /usr/local/bin/threatcode
