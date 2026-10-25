<template>
  <div class="book-grid"><slot /></div>
</template>

<style scoped>
.book-grid {
  display: grid;
  gap: 1.1rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
}
</style>
