#!/bin/sh
set -e
cd $(dirname $(realpath $0))

set -x
../bin.js ./vbb-hafas.js stopover bbox 52.6 13.3 52.3 13.6
