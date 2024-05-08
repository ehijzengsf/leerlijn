'use strict'
const path = require('path')
const AutoLoad = require('@fastify/autoload')
const port = process.env.PORT || 3000


// Pass --options via CLI arguments in command to enable these options.
const options = {}
const pjson = require('./package.json')

module.exports = async function (fastify, opts) {
    // Place here your custom code!
    fastify.register(require('@fastify/swagger'), {
        host: process.env.NODE_ENV === 'production' ? process.env.HEROKU_HOST : `127.0.0.1:${port}`,
        schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http', 'https'],
    })
    fastify.register(require('@fastify/swagger-ui'), {
        routePrefix: '/docs',
        swagger: {
            info: {
                title: pjson.title,
                description: pjson.description,
                version: pjson.version,
                termsOfService: pjson.terms_of_service,
                contact: {
                  name: pjson.author,
                  url: pjson.website,
                  email: pjson.email
                    }
                },
          
            externalDocs: {
                url: 'https://www.johndoe.com/api/',
                description: 'Find more info here'
            },
            host: '127.0.0.1:3000',
            basePath: '',
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [{
                name: 'User',
                description: 'User\'s API'
            }, ],
            definitions: {
                User: {
                    type: 'object',
                    required: ['id', 'email'],
                    properties: {
                        id: {
                            type: 'number',
                            format: 'uuid'
                        },
                        firstName: {
                            type: 'string'
                        },
                        lastName: {
                            type: 'string'
                        },
                        email: {
                            type: 'string',
                            format: 'email'
                        }
                    }
                },
            },
        },
        uiConfig: {
            docExpansion: 'none', // expand/not all the documentations none|list|full
            deepLinking: true
        },
        uiHooks: {
            onRequest: function(request, reply, next) {
                next()
            },
            preHandler: function(request, reply, next) {
                next()
            }
        },
        staticCSP: false,
        transformStaticCSP: (header) => header,
        exposeRoute: true
    })
    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts)
    })

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({}, opts)
    })
    fastify.register(require('@fastify/cors'), {
        origin: [
            `http://localhost:${port}`,
            `http://127.0.0.1:${port}`, 
            process.env.HEROKU_URL
          ],
        methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
    })
}

module.exports.options = options
