// ESM
import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import socketioServer from 'fastify-socket.io'
import fastifyJwt from '@fastify/jwt'
import fastifyBcrypt from 'fastify-bcrypt'

import { routes } from './routes/routes.js'

export const fastify = Fastify({ logger: true })

await fastify.register(fastifyCors, {
    origin: [
        'http://127.0.0.1:5000',
        'http://localhost:5000',
        'https://inteligenemt.github.io',
        'https://adrianper.github.io',
        'https://front-end-api.vercel.app',
        'https://front-end-api-git-main-adrianper.vercel.app',
        'https://front-end-api-adrianper.vercel.app'
    ],
    credentials: true,
    exposedHeaders: ['Set-Cookie']
})

await fastify.register(fastifyCookie, {
    secret: "my-secret", // for cookies signature
    hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    // parseOptions: {}  // options for parsing cookies
})
await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    // cookie: {
    //     cookieName: 'x-access-token', //change default jwtVerify (Headers 'Authorization' Bearer [token]) 
    //     signed: false
    // }
})
await fastify.register(fastifyBcrypt, { saltWorkFactor: 12 })
await fastify.register(socketioServer, {
    cors: {
        origin: [
            'http://127.0.0.1:5000',
            'http://localhost:5000',
            'https://adrianper.github.io',
            'https://inteligenemt.github.io',
            'https://front-end-api-tqcg.vercel.app',
            'https://front-end-api-tqcg-50tpqa0to-adrianper.vercel.app',
            'https://front-end-api-tqcg-adrianper.vercel.app',
            'https://front-end-api-tqcg-git-main-adrianper.vercel.app'
        ]
    }
})

const authenticateRoutes = ['/auth/logout', '/users_posts']

fastify.addHook("onRequest", async (request, reply) => {
    try {
        if (!authenticateRoutes.includes(request.routerPath)) return
        await request.jwtVerify()
    } catch (error) {
        reply.code(error.statusCode).send({ error: error.message, code: error.code })
    }
})

/**
 * Generate routes
 */
fastify.get('/', async (request, reply) => {
    return { hello: `World ${process.env.ENVIRONMENT}!` }
})

routes.forEach(route => { fastify.route(route) })

fastify.io.on('connection', socket => {
    socket.on('message', message => {
        try {
            if (!message.user || message.user === '') message.user = socket.id.slice(-6)

            socket.broadcast.emit('message', message)

        } catch (error) {
            fastify.log.error('error on message', error)
        }
    })

})

/**
 * Run the server!
 */
const start = async () => {
    try {
        fastify.listen({ port: process.env.PORT || 8080 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
    // .finally(() => {
    //     prismaMongoDB.$disconnect()
    // })
    // .catch(() => {
    //     prismaMongoDB.$disconnect()
    // })
