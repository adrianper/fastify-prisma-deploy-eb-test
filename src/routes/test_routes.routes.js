import { fastify } from "../app.js"
import { prisma, prismaMongoDB } from "../prismaClient.js"

export const testRoutes = [
    {
        url: '/mongodb',
        method: 'GET',
        handler: async (request, reply) => {
            const userComments = await prismaMongoDB.userComment.findMany()
            return userComments
        }
    },
    {
        url: '/socketio',
        method: 'GET',
        handler: (request, reply) => {
            fastify.io.emit('testing', `Socket io is working! :)`)
            return { socketioEmit: 'testing', message: 'Add "testing" listener in postman to see message' }
        }
    },
    {
        url: '/authenticate',
        method: 'POST',
        handler: async (request, reply) => {
            const { email, password } = request.body
            // const { email, password } = {email: 'john@mail.com', password: 'password'}

            try {
                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (!user) return { error: 'User does not exist' }

                const matchPassword = await fastify.bcrypt.compare(password, user.password)

                if (!matchPassword) return { error: 'Password incorrect!' }

                const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: '1h' })

                // return { token, user: exclude(user, ['password']) }
                await reply
                    .cookie('x-access-token', token)
                    .send({ token })

            } catch (error) {
                return { error: error.message }
            }

        }
    },
    {
        url: '/test_get',
        method: 'GET',
        handler: async (request, reply) => {
            try {
                console.log(request.params)

                return { helloTest: request.routerPath }
            } catch (error) {
                return { error }
            }
        },
    },
    {
        url: '/test_post',
        method: 'POST',
        handler: async (request, reply) => {
            try {
                console.log(request.cookies)
                console.log(request.body)

                return { helloTest: request.routerPath }
            } catch (error) {
                return { error }
            }
        },
    },
]