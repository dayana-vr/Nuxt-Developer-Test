<template>
  <div class="page">
    <div class="header">
      <div>
        <h1>Products</h1>
        <p class="subtitle">Manage your catalog and inventory</p>
      </div>

      <div class="actions">
        <input v-model="search" placeholder="Search products..." class="input" />
      
        <button class="btn primary" @click="openCreate" :disabled="loadingAction">
          + New
        </button>
      </div>
    </div>

    <div v-if="!loadingList && products.length" class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Visibility</th>
            <th class="actions-col"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in products" :key="p.id" class="row">
            <td class="name">{{ p.name }}</td>
            <td class="desc">{{ p.description }}</td>
            <td class="category">
              <span class="badge gray">{{ p.category }}</span>
            </td>
            <td class="price">${{ p.price }}</td>
            <td>{{ p.stock }}</td>

            <td>
              <span class="badge" :class="p.isPublic ? 'green' : 'red'">
                {{ p.isPublic ? 'Public' : 'Private' }}
              </span>
            </td>

            <td class="actions-cell">
              <button class="icon-btn edit" title="Edit" @click="edit(p)">
                ✏️
              </button>

              <button class="icon-btn danger" title="Delete" @click="openDelete(p.id)">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProductTableSkeleton v-if="loadingList" />
    <EmptyState v-if="!loadingList && products.length === 0" />

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
        {{ page }} / {{ totalPages }} · {{ pagination.total }} items
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal large">
        <h3>{{ editingId ? "Edit Product" : "Create Product" }}</h3>

        <p v-if="error" class="form-error">
          {{ errorMessage }}
        </p>

        <div class="form-layout">
          <div class="field" style="grid-column: span 2;">
            <label>Name *</label>
            <input v-model="form.name" class="input" />
          </div>

          <div class="field" style="grid-column: span 2;">
            <label>Category *</label>
            <input
              v-model="form.category"
              class="input"
              required
            />
          </div>

          <div class="field">
            <label>Image URL</label>
            <input v-model="form.imageUrl" class="input" />
          </div>

          <div class="field full">
            <label>Description *</label>
            <textarea v-model="form.description" class="textarea"></textarea>
          </div>

          <div class="field">
            <label>Price *</label>
            <input v-model.number="form.price" type="number" step="0.01" class="input small" />
          </div>

          <div class="field">
            <label>Stock *</label>
            <input v-model.number="form.stock" type="number" step="1" min="0" class="input small" />
          </div>

          <div class="field">
            <label>Public *</label>
            <label class="checkbox-inline">
              <input type="checkbox" v-model="form.isPublic" />
              Visible
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn ghost" @click="closeModal">Cancel</button>
          <button class="btn primary" @click="save" :disabled="loadingAction">
            Save
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="modal small">
        <h3>Delete product</h3>

        <p class="danger-text">
          Are you sure you want to delete this product?<br /><br />
          <strong>This action cannot be undone.</strong>
        </p>

        <div class="modal-actions">
          <button class="btn ghost" @click="showDeleteModal = false">Cancel</button>
          <button class="btn danger" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDebounce } from "@vueuse/core"
  import { productSchema } from "~~/utils/productSchema"
  import type { Product } from "~/types/product"

  const {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    products
  } = useProducts()

  const page = ref(1)
  const search = ref("")
  const debouncedSearch = useDebounce(search, 500)

  const showModal = ref(false)
  const editingId = ref<string | null>(null)

  const loadingList = ref(false)
  const loadingAction = ref(false)

  const error = ref(false)
  const errorMessage = ref("")

  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  })

  const totalPages = computed(() => pagination.value.pages)
    const form = ref({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      imageUrl: "",
      isPublic: true
    })

  const clearError = () => {
    error.value = false
    errorMessage.value = ""
  }

  const load = async () => {
    loadingList.value = true
    clearError()

    try {
      const res = await fetchProducts({
        page: page.value,
        limit: 10,
        search: debouncedSearch.value
      })

      pagination.value = res.pagination ?? {
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
      }
    } catch {
      error.value = true
      errorMessage.value = "Error loading products"
    } finally {
      loadingList.value = false
    }
  }

  await load()

  watch(page, load)

  watch(debouncedSearch, () => {
    page.value = 1
    load()
  })

  const openCreate = () => {
    editingId.value = null
    clearError()

    form.value = {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      imageUrl: "",
      isPublic: true
    }

    showModal.value = true
  }

  const edit = (p: Product) => {
    editingId.value = p.id
    clearError()

    form.value = { ...p }
    showModal.value = true
  }

  const save = async () => {
    const result = productSchema.safeParse(form.value)

    if (!result.success) {
      error.value = true
      errorMessage.value =
        result.error.issues?.[0]?.message ?? "Validation error"
      return
    }

    loadingAction.value = true
    clearError()

    try {
      if (editingId.value) {
        await updateProduct(editingId.value, result.data)
      } else {
        await createProduct(result.data)
      }

      showModal.value = false
      await load()
    } catch {
      error.value = true
      errorMessage.value = "Error saving product"
    } finally {
      loadingAction.value = false
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Delete product?")) return

    loadingAction.value = true
    clearError()

    try {
      await deleteProduct(id)
      await load()
    } catch {
      error.value = true
      errorMessage.value = "Error deleting product"
    } finally {
      loadingAction.value = false
    }
  }

  const togglePublic = async (p: Product) => {
    loadingAction.value = true
    clearError()

    try {
      await updateProduct(p.id, {
        isPublic: !p.isPublic
      })

      await load()
    } catch {
      error.value = true
      errorMessage.value = "Error updating visibility"
    } finally {
      loadingAction.value = false
    }
  }

  const showDeleteModal = ref(false)
    const deleteId = ref<string | null>(null)

    const openDelete = (id: string) => {
      deleteId.value = id
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!deleteId.value) return

      loadingAction.value = true
      clearError()

      try {
        await deleteProduct(deleteId.value)
        await load()
      } catch {
        error.value = true
        errorMessage.value = "Error deleting product"
      } finally {
        loadingAction.value = false
        showDeleteModal.value = false
        deleteId.value = null
      }
    }

  const closeModal = () => {
    showModal.value = false
    clearError()
  }
</script>
