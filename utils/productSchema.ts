import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(3, "Name must have at least 3 characters"),
    description: z.string().min(3, "Description too short"),
    price: z.number().min(1, "Price must be greater than 0"),
    stock: z.number().min(1, "Stock must be greater than 0"),
    category: z.string().min(1, "The category is mandatory"),
    imageUrl: z.string().trim().optional().or(z.literal("")),
    isPublic: z.boolean()
})