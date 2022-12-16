// ESM
import Fastify from 'fastify'

import { userRoutes } from './routes/users/users.routes.js'

const fastify = Fastify({ logger: true })

/**
 * Generate routes
 */
userRoutes.forEach(route => { fastify.route(route) })

fastify.get('/', async (request, reply) => {
    return { hello: 'world!' }
})

/**
 * Run the server!
 */
const start = async () => {
    try {
        // await prisma.$connect().then(() => { console.log('DB Connected') })
        await fastify.listen({ port: process.env.PORT || 8080 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
