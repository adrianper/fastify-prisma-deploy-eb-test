// ESM
import Fastify from 'fastify'
import { prismaMongoDB } from './prismaClient.js'
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
        'https://adrianper.github.io'
    ],
    credentials: true
})

await fastify.register(fastifyCookie, {
    secret: "my-secret", // for cookies signature
    hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    // parseOptions: {}  // options for parsing cookies
})
await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    cookie: {
        cookieName: 'x-access-token',
        signed: false
    }
})
await fastify.register(fastifyBcrypt, { saltWorkFactor: 12 })
await fastify.register(socketioServer, {
    cors: {
        origin: [
            'http://127.0.0.1:5000',
            'http://localhost:5000',
            'https://adrianper.github.io'
        ]
    }
})

const authenticateRoutes = ['/auth/logout', '/users_posts']

fastify.addHook("onRequest", async (request, reply) => {
    console.log('ROUTE PATH---', request.routerPath)
    try {
        if (!authenticateRoutes.includes(request.routerPath)) return
        const token = await request.jwtVerify()
        reply.headers({ 'Access-Control-Allow-Origin': 'http://localhost:5000' })
    } catch (error) {
        console.error('--------------\n', error)
        reply.code(error.statusCode).send({ message: error.message, code: error.code })
    }
})

/**
 * Generate routes
 */
routes.forEach(route => { fastify.route(route) })


fastify.get('/', async (request, reply) => {
    return { hello: `World ${process.env.ENVIRONMENT}!` }
})

fastify.get('/mongodb', async (request, reply) => {
    const userComments = await prismaMongoDB.userComment.findMany()
    return userComments
})

fastify.io.on('connection', socket => {
    console.log('User connected: ', socket.id)

    socket.on('message', message => {
        if (!message.user || message.user === '') message.user = socket.id.slice(-6)

        socket.broadcast.emit('message', message)
    })

})

fastify.get('/socketio', (req, reply) => {
    fastify.io.emit('testing', `Socket io is working! :)`)
    return null
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
