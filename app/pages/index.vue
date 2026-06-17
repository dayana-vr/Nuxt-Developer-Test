<template>
  <div class="products-page">

    <div class="products-header">
      <div class="products-title-wrapper">
        <h1 class="products-title">Products</h1>

        <span class="products-total">
          {{ pagination.total }} items
        </span>
      </div>

      <div class="products-filters">
        <input v-model="search" placeholder="Search..." />

        <select v-model="category" class="filter-select">
          <option value="">All categories</option>

          <option
            v-for="c in categories"
            :key="c"
            :value="c"
          >
            {{ c }}
          </option>
        </select>

        <input v-model="minPrice" type="number" placeholder="Min price" />
        <input v-model="maxPrice" type="number" placeholder="Max price" />
      </div>
    </div>

    <div
      v-for="[cat, items] in grouped"
      :key="cat"
      class="category-section"
    >
      <div class="category-header">
        <h2 class="category-title">{{ cat }}</h2>
        <span class="category-count">{{ items.length }} items</span>
      </div>

      <div class="products-grid">
        <ProductCard
          v-for="p in items"
          :key="p.id"
          :product="p"
          @view="openDetails"
        />
      </div>
    </div>

    <div class="pagination-product">
      <div class="pagination-controls">
        <button class="icon-nav" @click="page--" :disabled="page === 1">
          ‹
        </button>

        <button class="icon-nav" @click="page++" :disabled="page === totalPages">
          ›
        </button>
      </div>
      <div class="pagination-info">
        {{ page }} / {{ totalPages }}
      </div>
    </div>

  </div>

  <div v-if="selectedProduct" class="product-modal-backdrop" @click="closeDetails">
    <div class="product-modal" @click.stop>

      <div class="product-modal__image">
        <img :src="selectedProduct.imageUrl" />
      </div>

      <div class="product-modal__content">
        <h2 class="product-modal__name">
          {{ selectedProduct.name }}
        </h2>

        <p class="product-modal__desc">
          {{ selectedProduct.description }}
        </p>

        <div class="product-modal__grid">
          <div><strong>Category:</strong> {{ selectedProduct.category }}</div>
          <div><strong>Price:</strong> ${{ selectedProduct.price }}</div>
          <div><strong>Stock:</strong> {{ selectedProduct.stock }}</div>
        </div>

        <button class="product-modal__close" @click="closeDetails">
          Close
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Product } from "~/types/product"

  const pagination = ref({
    pages: 1,
    page: 1,
    total: 0
  })

  const totalPages = computed(() => pagination.value.pages)

  const page = ref(1)
  const search = ref("")
  const category = ref("")
  const minPrice = ref("")
  const maxPrice = ref("")

  const categories = ref<string[]>([])

  const loadCategories = async () => {
    categories.value = await $fetch("/api/products/categories")
  }

  await loadCategories()

  const selectedProduct = ref<Product | null>(null)

  const openDetails = (p: Product) => {
    selectedProduct.value = p
  }

  const closeDetails = () => {
    selectedProduct.value = null
  }

  const { products, fetchProducts } = useProducts()

  const toNumberOrUndefined = (v: any) => {
    if (v === "" || v === null || v === undefined) return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }

  const grouped = computed(() => {
    const map: Record<string, Product[]> = {}

    for (const p of products.value) {
      if (!map[p.category]) map[p.category] = []
      map[p.category].push(p)
    }

    return Object.entries(map)
  })

  const buildQuery = () => {
    const q: Record<string, any> = {
      page: page.value,
      isPublic: true
    }

    if (search.value.trim()) q.search = search.value.trim()
    if (category.value.trim()) q.category = category.value.trim()

    const min = toNumberOrUndefined(minPrice.value)
    const max = toNumberOrUndefined(maxPrice.value)

    if (min !== undefined) q.minPrice = min
    if (max !== undefined) q.maxPrice = max

    return q
  }

  const load = async () => {
    const res = await fetchProducts(buildQuery())

    pagination.value = res.pagination
  }

  await load()

  watch([page, search, category, minPrice, maxPrice], () => {
    load()
  })
</script>