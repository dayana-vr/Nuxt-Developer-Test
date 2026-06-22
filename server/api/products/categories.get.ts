import { prisma } from "~~/server/utils/prisma"

export default defineEventHandler(async () => {
    const result = await prisma.product.findMany({
        where: {
            isPublic: true
        },
        distinct: ["category"],
        select: {
            category: true
        }
    })

    return result
        .map(r => r.category.trim())
        .sort((a, b) =>
            a.localeCompare(b, "en", { sensitivity: "base" })
        )
})