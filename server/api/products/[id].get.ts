import { prisma } from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {

    const id = getRouterParam(event, "id")

    if (!id) {
        throw createError({
            statusCode: 400,
            message: "Invalid ID"
        })
    }

    const product = await prisma.product.findUnique({
        where: {
            id
        }
    })

    if (!product) {
        throw createError({
            statusCode: 404,
            message: "Product not found"
        })
    }

    return product

})