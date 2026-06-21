import { Product } from "@prisma/client"

export default defineEventHandler(async (event): Promise<Product> => {
    const body = await readBody(event)

    if (!body?.name || !body?.price || !body?.stock || !body?.category) {
        throw createError({
            statusCode: 400,
            message: "Missing required fields"
        })
    }

    const product: Product = await prisma.product.create({
        data: {
            name: body.name,
            description: body.description ?? "",
            price: Number(body.price),
            stock: Number(body.stock),
            category: body.category,
            imageUrl: body.imageUrl ?? null,
            isPublic: body.isPublic ?? true
        }
    })

    setResponseStatus(event, 201)

    return product
})