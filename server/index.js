const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const fs = require('fs')


// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
	// Init Nuxt.js
	const nuxt = new Nuxt(config)

	const { host, port } = nuxt.options.server

	// Build only in dev mode
	if (config.dev) {
		const builder = new Builder(nuxt)
		await builder.build()
	} else {
		await nuxt.ready()
	}

	// Give nuxt middleware to express
	app.use(nuxt.render)

	// Listen the server
	// app.listen(port, host, () => {})

	app.listen('/tmp/nginx.socket', () => {
		console.log("Signalling nginx buildpack to start listening")
		fs.openSync('/tmp/app-initialized', 'w')
	})
	
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	})
}
start()
