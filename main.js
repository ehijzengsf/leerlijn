'use strict'
require('dotenv').config()              // Read the .env file
const Fastify = require('fastify')      // Require the framework
const port = process.env.PORT || 3000   // Sets the heroku/default port to listen// Instantiate Fastify with some config
const app = Fastify({
  logger: true
})// Register your application as a normal plugin.
const appService = require('./app.js')
app.register(appService)// delay is the number of milliseconds for the graceful close to finish
// Require library to exit fastify process, gracefully (if possible)
const closeWithGrace = require('close-with-grace')  
const closeListeners = closeWithGrace({ delay: 500 }, 
    async function ({ signal, err, manual }) {
    if (err) {
      app.log.error(err)
    }
    await app.close()
  })
  app.addHook('onClose', (instance, done) => {
  closeListeners.uninstall()
  done()
})// Start listening
app.listen({ port: port }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})