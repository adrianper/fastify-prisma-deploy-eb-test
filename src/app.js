// ESM
import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import { prismaMongoDB } from './prismaClient.js'

import { userRoutes } from './routes/users/users.routes.js'

const fastify = Fastify({ logger: true })

await fastify.register(websocket)

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

fastify.get('/websocket', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    connection.socket.on('message', message => {
        connection.socket.send(`Hello from Fastify Websocket, your message: ${message}`)
    })
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
