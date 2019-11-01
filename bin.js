#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'file', 'f',
		'pretty-print', 'p'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Monitoring stations:
	monitor-hafas <hafas-client> <list of events> stations <list of stations>
	monitor-hafas <hafas-client> <list of events> stations --file <file with stations>
	available events: departure, stopover
Monitoring trips in a bounding box:
	monitor-hafas <hafas-client> <list of events> bbox <north> <west> <south> <east>
	available events: trip, new-trip, trip-obsolete, stopover, position
Options:
	--file          -f  Read the list of stations from a JSON file.
	--pretty-print  -f  Pretty print data instead of JSON.
	--interval      -i  Query interval in seconds. Default: 30
Examples:
	monitor-hafas bvg-hafas departure stations 900000100001,900000100003
	monitor-hafas ./my-hafas-client.js departure,stopover stations --file stations.json
	monitor-hafas some-package/my-hafas-client.js stopover,position bbox 52.6 13.3 52.3 13.6
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`parse-url v${pkg.version}\n`)
	process.exit(0)
}

const resolve = require('resolve-from')
const {inspect} = require('util')
const createStationsMonitor = require('hafas-monitor-departures')
const createBboxMonitor = require('hafas-monitor-trips')
const supportsColor = require('supports-color')
const {isatty} = require('tty')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

if (!argv._[0]) showError('Missing hafas-client argument.')
let hafasClient
try {
	hafasClient = require(resolve(process.cwd(), argv._[0]))
} catch (err) {
	showError('Failed to `require` the HAFAS client.\n\n' + inspect(err))
}

const events = argv._[1].split(',')
if (events.some(e => !e)) showError('Invalid list of events.')

const interval = parseInt(argv.interval || argv.i || 30) * 1000
if (Number.isNaN(interval)) showError('interval must be an integer.')

const mode = argv._[2]
let monitor
if (!mode) showError('Missing mode. Must be "stations" or "bbox".')
if (mode === 'stations') {
	// todo: --file/-f option
	const stations = argv._[3].split(',')
	monitor = createStationsMonitor(hafasClient, stations, {
		interval
		// todo: more options
	})
} else if (mode === 'bbox') {
	monitor = createBboxMonitor(hafasClient, {
		north: parseFloat(argv._[3]),
		west: parseFloat(argv._[4]),
		south: parseFloat(argv._[5]),
		east: parseFloat(argv._[6])
	}, interval)
} else showError('Invalid mode. Must be "stations" or "bbox".')

let formatter = eventName => val => {
	process.stdout.write(JSON.stringify([eventName, val]) + '\n')
}
if (argv['pretty-print'] || argv.p) {
	const colors = supportsColor.stdout
	formatter = eventName => val => {
		const inspected = inspect(val, {depth: null, colors})
		process.stdout.write(`${eventName}: ${inspected}\n`)
	}
}

events.forEach((eventName) => {
	monitor.on(eventName, formatter(eventName))
})

if (
	!events.includes('stats') &&
	isatty(process.stderr.fd) &&
	!isatty(process.stdout.fd)
) {
	monitor.on('stats', console.error)
}
