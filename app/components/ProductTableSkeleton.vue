<template>
  <div class="space-y-3">
    <div
      v-for="i in 5"
      :key="i"
      class="h-12 rounded bg-gray-200 animate-pulse"
    />
  </div>
</template>