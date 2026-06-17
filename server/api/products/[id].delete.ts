export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id")

    if (!id) {
        throw createError({
            statusCode: 400,
            message: "Invalid id"
        })
    }

    const product = await prisma.product.findUnique({
        where: { id }
    })

    if (!product) {
        throw createError({
            statusCode: 404,
            message: "Product not found"
        })
    }

    await prisma.product.delete({
        where: { id }
    })

    setResponseStatus(event, 204)
    return null
})