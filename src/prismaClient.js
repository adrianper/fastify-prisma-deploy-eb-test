import { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaClientMongoDB } from "../prisma/generated/clientMongo/index.js";

export const prisma = new PrismaClient()

export const prismaMongoDB = new PrismaClientMongoDB()
