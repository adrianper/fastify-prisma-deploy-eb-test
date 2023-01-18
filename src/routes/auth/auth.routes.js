import { fastify } from "../../app.js"
import { prisma } from "../../prismaClient.js"

const exclude = (object = {}, keys = []) => {
    keys.forEach(key => {
        delete object[key]
    })

    return object
}

export const authRoutes = [
    {
        url: '/auth/signup',
        method: 'POST',
        handler: async (request, reply) => {
            const { name, email, password } = request.body

            try {
                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (user) reply.status(400).send({ error: 'User already exists', code: 'BAD_SUPPLIED_USER' })
                // return { error: 'User already exists' }

                const newUser = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: await fastify.bcrypt.hash(password),
                    },
                })

                const token = fastify.jwt.sign({ userId: newUser.id }, { expiresIn: '1m' })

                return { token, user: exclude(newUser, ['password']) }
            } catch (error) {
                reply.status(500).send({ error: error.message, code: error.code })
                // return { error: error.message }
            }
        }
    },
    {
        url: '/auth/login',
        method: 'POST',
        handler: async (request, reply) => {
            const { email, password } = request.body

            try {
                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (!user) return { error: 'User does not exist' }

                const matchPassword = await fastify.bcrypt.compare(password, user.password)

                if (!matchPassword) reply.status(400).send({ error: 'Password incorrect', code: 'BAD_SUPPLIED_PASSWORD' })
                // return { error: 'Password incorrect!' }

                const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: '1m' })

                return { token, user: exclude(user, ['password']) }

            } catch (error) {
                reply.status(500).send({ error: error.message, code: error.code })
                // return { error: error.message }
            }
        }
    },
    {
        url: '/auth/logout',
        method: 'POST',
        handler: async (request, reply) => {

            // const user = await prisma.user.findUnique()
            console.log(fastify)
            console.log(reply)
            return { hello: 'logout' }
        }
    },
]