// ESM
// import Fastify from 'fastify'
// const fastify = Fastify({
//     logger: true
// })
// CommonJs
const fastify = require('fastify')({
    logger: true
})

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
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