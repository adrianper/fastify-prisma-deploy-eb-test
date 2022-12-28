// ESM
import Fastify from 'fastify'
import { prismaMongoDB } from './prismaClient.js'
import socketioServer from 'fastify-socket.io'
import fastifyCors from '@fastify/cors'

import { userRoutes } from './routes/users/users.routes.js'

const fastify = Fastify({ logger: true })

await fastify.register(fastifyCors)

await fastify.register(socketioServer, {
    cors: {
        origin: [
            'http://localhost:5000',
            'https://adrianper.github.io'
        ]
    }
})

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

    socket.on('message', message => {
        if(!message.user || message.user === '') message.user = socket.id.slice(-6)
        
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
