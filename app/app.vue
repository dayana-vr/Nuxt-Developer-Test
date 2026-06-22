<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>

<script setup lang="ts">
import { Toaster } from "vue-sonner"
import "vue-sonner/style.css"
</script>