import { fastify } from "../../app.js"
import { prisma } from "../../prismaClient.js"

export const authRoutes = [
    {
        url: '/test_get',
        method: 'GET',
        handler: async (request, reply) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {id: 1}
                })

                const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: '1m' })

                await reply.cookie('x-access-token', token, {
                    path: '/',
                    httpOnly: true,
                    sameSite: true
                }).send({ token })
                
            } catch (error) {
                return { error }
            }
        },
    },
    {
        url: '/test',
        method: 'POST',
        handler: async (request, reply) => {
            try {
                console.log(request.cookies)
                // request.jwtVerify()
                return { helloFrom: request.routerPath }
            } catch (error) {
                return { error }
            }
        },
    },
    {
        url: '/auth/login',
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

                const token = fastify.jwt.sign({ userId: user.id }, { expiresIn: '1m' })

                await reply.cookie('x-access-token', token, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'None'
                }).send({ token })

            } catch (error) {
                return { message: `Server error: ${error.message}` }
            }
        }
    },
    {
        url: '/auth/logout',
        method: 'POST',
        handler: async (request, reply) => {
            console.log(fastify)
            console.log(reply)
            // await fastify.cookie.clearCookie('x-access-vtoken').status(200).send({ success: 'loged out' })
            return { hello: 'logout' }
        }
    },
    {
        url: '/auth/signup',
        method: 'POST',
        handler: async (request, reply) => {
            const { name, email, password } = request.body

            try {
                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (user) return { error: 'User already exists' }

                // const token = fastify.jwt.sign()

                const newUser = await prisma.user.create({
                    data: { email, name, password: fastify.bcrypt.hash(password) },
                })

                return { hello: 'signup', user: newUser.include({ email: true, name: true }) }
            } catch (error) {
                return { message: 'Server error' }
            }
        }
    },
]