import {PrismaClient}  from "@prisma/client"


export const prismaClient:PrismaClient = new PrismaClient()


console.log("this file is running")