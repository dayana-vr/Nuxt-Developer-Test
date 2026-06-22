<template>
  <div class="product-card">
    <div class="product-card__imageWrapper">
      
      <img
        v-if="!imgError"
        :src="product.imageUrl"
        class="product-card__image"
        @error="onError"
      />

      <div v-else class="product-card__imageFallback">
        Image not available
      </div>

    </div>

    <div class="product-card__content">
      <h2 class="product-card__name">
        {{ product.name }}
      </h2>

      <p class="product-card__desc">
        {{ product.description }}
      </p>

      <div class="product-card__price">
        ${{ product.price }}
      </div>

      <div class="product-card__stock">
        <span v-if="product.stock === 0" class="stock-out">
          Out of stock
        </span>

        <span v-else>
          Stock: {{ product.stock }}
        </span>
      </div>

      <button class="product-card__details" @click="$emit('view', product)">
        View details <span class="arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ product: any }>()
  defineEmits<{ (e: "view", product: any): void }>()

  const imgError = ref(false)

  const onError = () => {
    imgError.value = true
  }
</script>