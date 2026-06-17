export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id")
    const body = await readBody(event)

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

    const updated = await prisma.product.update({
        where: { id },
        data: {
            name: body.name ?? product.name,
            description: body.description ?? product.description,
            price: body.price !== undefined ? Number(body.price) : product.price,
            stock: body.stock !== undefined ? Number(body.stock) : product.stock,
            category: body.category ?? product.category,
            imageUrl: body.imageUrl ?? product.imageUrl,
            isPublic: body.isPublic ?? product.isPublic
        }
    })

    return updated
})