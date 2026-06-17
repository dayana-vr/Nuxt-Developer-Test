export interface Product {
    id: string
    name: string
    description: string
    price: number
    stock: number
    category: string
    imageUrl?: string | null
    isPublic: boolean
    createdAt: string
    updatedAt: string
}

export interface ProductFilters {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    isPublic?: boolean
}

export type ProductResponse = {
    data: Product[]
    pagination: {
        page: number
        pages: number
        total: number
    }
}