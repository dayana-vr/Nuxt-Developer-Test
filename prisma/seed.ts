import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

async function main() {

    await prisma.product.deleteMany()

    const products = Array.from({ length: 100 }).map(() => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 100 }),
        category: faker.commerce.department(),
        imageUrl: faker.image.url(),
        isPublic: faker.datatype.boolean(),
    }))

    await prisma.product.createMany({
        data: products
    })
}

main()
    .then(() => prisma.$disconnect())
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
    })