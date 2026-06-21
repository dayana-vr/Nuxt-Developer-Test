import { Product } from "@prisma/client"
import { prisma } from "~~/server/utils/prisma"

export default defineEventHandler(async (event): Promise<Product> => {

    const id = getRouterParam(event, "id")

    if (!id) {
        throw createError({
            statusCode: 400,
            message: "Invalid ID"
        })
    }

    const product: Product | null = await prisma.product.findUnique({
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