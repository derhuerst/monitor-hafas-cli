# monitor-hafas-cli

**Monitor any HAFAS endpoint from the command line.**

[![npm version](https://img.shields.io/npm/v/monitor-hafas-cli.svg)](https://www.npmjs.com/package/monitor-hafas-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/monitor-hafas-cli.svg)
![minimum Node.js version](https://img.shields.io/node/v/monitor-hafas-cli.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installation

```shell
npm install -g monitor-hafas-cli
```

Or use [`npx`](https://npmjs.com/package/npx). ✨


## Getting started

As an example, we're going to monitor the [VBB](https://en.wikipedia.org/wiki/Verkehrsverbund_Berlin-Brandenburg) HAFAS endpoint, using [`vbb-hafas@7`](https://npmjs.com/package/vbb-hafas/tree/7).

```shell
# make an empty project to play around
mkdir vbb-monitoring
cd vbb-monitoring
npm init --yes

# set up HAFAS client
npm install vbb-hafas@7
echo 'const createHafas = require("vbb-hafas")' >>hafas.js
echo 'const hafas = createHafas("vbb monitoring example")' >>hafas.js
echo 'module.exports = hafas' >>hafas.js

# set up monitoring
events='departure'
stations='900000100001,900000100003'

# run monitor-hafas-cli using npx
npx monitor-hafas-cli ./hafas.js $events stations $stations
# or install & run monitor-hafas-cli manually
npm install monitor-hafas-cli
./node_modules/.bin/monitor-hafas ./hafas.js $events stations $stations
```


## Usage

```
Monitoring stations:
	monitor-hafas <hafas-client> <list of events> stations <list of stations>
	monitor-hafas <hafas-client> <list of events> stations --file <file with stations>
	available events: departure, stopover, stats
Monitoring trips in a bounding box:
	monitor-hafas <hafas-client> <list of events> bbox <north> <west> <south> <east>
	available events: trip, new-trip, trip-obsolete, stopover, position, stats
Options:
	--file          -f  Read the list of stations from a JSON file.
	--pretty-print  -f  Pretty print data instead of JSON.
	--interval      -i  Query interval in seconds. Default: 30
	--show-stats    -s  Always show request stats.
Examples:
	monitor-hafas vbb-hafas departure stations 900000100001,900000100003
	monitor-hafas ./my-hafas-client.js departure,stopover stations --file stations.json
	monitor-hafas some-package/my-hafas-client.js stopover,position bbox 52.6 13.3 52.3 13.6
```


## Contributing

If you have a question or need support using `monitor-hafas-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/monitor-hafas-cli/issues).
