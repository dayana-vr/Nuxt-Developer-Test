<template>
  <div v-if="product">
    <img :src="product.imageUrl" />

    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>

    <p>Price: {{ product.price }}</p>
    <p>Stock: {{ product.stock }}</p>

    <NuxtLink to="/">Back</NuxtLink>
  </div>

  <p v-else-if="error">Error loading product</p>
  <p v-else>Loading...</p>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: product, error } = await useFetch(
  `/api/products/${route.params.id}`
)
</script>