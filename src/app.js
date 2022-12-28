// ESM
import Fastify from 'fastify'
import { prismaMongoDB } from './prismaClient.js'
import socketioServer from 'fastify-socket.io'
import fastifyCors from '@fastify/cors'

import { userRoutes } from './routes/users/users.routes.js'

const fastify = Fastify({ logger: true })

await fastify.register(fastifyCors, {
    cors: {
        origin: [
            'http://localhost:5000',
            'https://adrianper.github.io'
        ]
    }
})

await fastify.register(socketioServer)

/**
 * Generate routes
 */
userRoutes.forEach(route => { fastify.route(route) })

fastify.get('/', async (request, reply) => {
    const { env } = request.query
    return { hello: `World ${env}!` }
})

fastify.get('/mongodb', async (request, reply) => {
    const userComments = await prismaMongoDB.userComment.findMany()
    return userComments
})

fastify.io.on('connection', socket => {
    console.log('User connected: ', socket.id)

    fastify.io.on('message', message => {
        fastify.io.send(`Hello from Fastify Websocket, your message: ${message}`)
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
        await fastify.listen({ port: process.env.PORT || 8080 })
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
