import type { Product, ProductFilters, ProductResponse } from "~/types/product"

export const useProducts = () => {
    const products = ref<Product[]>([])
    const product = ref<Product | null>(null)

    const loadingList = ref(false)
    const loadingItem = ref(false)

    const error = ref<unknown>(null)

    const normalizeParams = (params: ProductFilters) => {
        const clean: Record<string, any> = {}

        for (const [key, value] of Object.entries(params)) {
            if (value === "" || value === null || value === undefined) continue
            clean[key] = value
        }

        return clean
    }

    const fetchProducts = async (params: ProductFilters = {}) => {
        loadingList.value = true
        error.value = null

        try {
            const res = await $fetch<ProductResponse>("/api/products", {
                query: normalizeParams(params)
            })

            products.value = (res.data ?? [])
                .slice()

            return res
        } catch (e) {
            error.value = e
            products.value = []
            throw e
        } finally {
            loadingList.value = false
        }
    }

    const fetchProduct = async (id: string) => {
        if (!id) return null

        loadingItem.value = true
        error.value = null

        try {
            const res = await $fetch<Product>(`/api/products/${id}`)

            product.value = res
            return res
        } catch (e) {
            error.value = e
            product.value = null
            throw e
        } finally {
            loadingItem.value = false
        }
    }

    const createProduct = async (data: Partial<Product>) => {
        const res = await $fetch<Product>("/api/products", {
            method: "POST",
            body: data
        })

        return res
    }

    const updateProduct = async (id: string, data: Partial<Product>) => {
        const res = await $fetch<Product>(`/api/products/${id}`, {
            method: "PATCH",
            body: data
        })

        return res
    }

    const deleteProduct = async (id: string) => {
        return await $fetch<void>(`/api/products/${id}`, {
            method: "DELETE"
        })
    }

    return {
        products,
        product,
        error,

        loadingList,
        loadingItem,

        fetchProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct
    }
}