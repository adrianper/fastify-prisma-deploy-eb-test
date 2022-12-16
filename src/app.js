// ESM
import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const fastify = Fastify({
    logger: true
})
// CommonJs
// const fastify = require('fastify')({
//     logger: true
// })

const prisma = new PrismaClient()

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

fastify.get('/users', async (request, reply) => {
    const users = await prisma.user.findMany()
    return users
})

// fastify.get('/create_user', async (request, reply) => {
//     const newUser = await prisma.user.create({
//         data: {
//             email: 'ana@mail.com',
//             name: 'ana',
//         }
//     })

//     return newUser
// })

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
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async () => {
        await prisma.$disconnect()
    })