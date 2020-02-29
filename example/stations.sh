#!/bin/sh
set -e
cd $(dirname $(realpath $0))

set -x
../bin.js ./vbb-hafas.js departure stations 900000100001,900000100003
