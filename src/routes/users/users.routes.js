import { prisma } from "../../prismaClient.js"

export const userRoutes = [
    // Get all users
    {
        url: '/users',
        method: 'GET',
        handler: async (request, reply) => {
            const users = await prisma.user.findMany()
            return users
        }
    },
    // Get one user
    {
        url: '/users/:id',
        method: 'GET',
        handler: async (request, reply) => {
            const { id } = request.params

            const user = await prisma.user.findUnique({
                where: { id },
            })

            return user
        },
        schema: {
            params: {
                properties: {
                    id: { type: 'number' }
                }
            }
        },
    },
    // get users with posts
    {
        url: '/users_posts',
        method: 'GET',
        handler: async (request, reply) => {
            const usersWithPosts = await prisma.user.findMany({
                include: { posts: true, },
            })
            return usersWithPosts
        },
    },
    // Create new user
    {
        url: '/users',
        method: 'POST',
        handler: async (request, reply) => {
            const { email, name } = request.body

            const user = await prisma.user.create({
                data: { email, name, },
            })

            return user
        }
    },
    // Update user
    {
        url: '/users/:id',
        method: 'PUT',
        handler: async (request, reply) => {
            const { id } = request.params
            const { email, name } = request.body

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { email, name },
            })

            return updatedUser
        },
        schema: {
            params: {
                properties: {
                    id: { type: 'number' }
                }
            }
        },
    },
    // Delete user
    {
        url: '/users/:id',
        method: 'DELETE',
        handler: async (request, reply) => {
            const { id } = request.params
            const user = await prisma.user.delete({
                where: { id }
            })
            return `User "${user.email}" has been deleted`
        },
        schema: {
            params: {
                properties: {
                    id: { type: 'number' }
                }
            }
        },
    },
]