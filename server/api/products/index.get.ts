import { prisma } from "~~/server/utils/prisma"
import type { Prisma } from "@prisma/client"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const page = Math.max(1, Number(query.page ?? 1))
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? 10)))

    const where: Prisma.ProductWhereInput = {}

    if (typeof query.category === "string" && query.category.trim() !== "") {
        where.category = query.category.trim()
    }

    if (typeof query.search === "string" && query.search.trim() !== "") {
        where.name = {
            contains: query.search.trim(),
            mode: "insensitive"
        }
    }

    const minPrice =
        typeof query.minPrice === "string" && query.minPrice !== ""
            ? Number(query.minPrice)
            : undefined

    const maxPrice =
        typeof query.maxPrice === "string" && query.maxPrice !== ""
            ? Number(query.maxPrice)
            : undefined

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {}

        if (Number.isFinite(minPrice)) {
            where.price.gte = minPrice
        }

        if (Number.isFinite(maxPrice)) {
            where.price.lte = maxPrice
        }
    }

    if (typeof query.isPublic === "string") {
        where.isPublic = query.isPublic === "true"
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [
                { category: "asc" },
                { name: "asc" }
            ]
        }),

        prisma.product.count({ where })
    ])

    return {
        data: products,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    }
})