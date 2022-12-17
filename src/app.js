// ESM
import Fastify from 'fastify'
import { prismaMongoDB } from './prismaClient.js'

import { userRoutes } from './routes/users/users.routes.js'

const fastify = Fastify({ logger: true })

/**
 * Generate routes
 */
userRoutes.forEach(route => { fastify.route(route) })

fastify.get('/', async (request, reply) => {
    return { hello: 'WORLD!' }
})

fastify.get('/mongodb', async (request, reply) => {
    const userComments = await prismaMongoDB.userComment.findMany()
    return userComments
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
