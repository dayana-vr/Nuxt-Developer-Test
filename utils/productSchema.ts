import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(3, "Name must have at least 3 characters"),
    description: z.string().min(10, "Description too short"),
    price: z.number().positive("Price must be positive"),
    stock: z.number().min(0),
    category: z.string().min(1),
    imageUrl: z.string().trim().optional().or(z.literal("")),
    isPublic: z.boolean()
})