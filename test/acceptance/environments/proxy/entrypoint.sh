#!/bin/bash
#
# © 2022 Threatcode Limited All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

set -ex

echo "Starting squid..."
sudo squid -f /etc/squid/squid.conf -NYCd 1 &
## configure firewall to only work through proxy
sudo iptables -A OUTPUT -m owner --uid-owner root -j ACCEPT
sudo iptables -A OUTPUT -m owner --uid-owner proxy -j ACCEPT
sudo iptables -A OUTPUT -p tcp --dport 80 -j REJECT
sudo iptables -A OUTPUT -p tcp --dport 443 -j REJECT
sudo Xvfb -ac :99 -screen 0 1280x1024x24 > /dev/null 2>&1 &
sleep 5 # wait for squid to startup
export PATH=$PATH:$PWD/.bin/pact/bin:$PWD/.bin/
export DISPLAY=:99
exec "$@"