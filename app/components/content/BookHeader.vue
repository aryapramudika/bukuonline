<script setup lang="ts">
import { withBase } from 'ufo'

const props = defineProps<{
  cover: string
  author?: string
  category?: string
  html?: string
  gutenberg?: string | number
}>()

const base = useRuntimeConfig().app.baseURL
const coverSrc = computed(() => withBase(props.cover, base))
const htmlHref = computed(() => (props.html ? withBase(props.html, base) : ''))
</script>

<template>
  <div class="book-header">
    <img class="book-header__cover" :src="coverSrc" alt="Sampul buku">
    <div class="book-header__meta">
      <p v-if="category" class="book-header__row"><UIcon name="i-lucide-folder" /> {{ category }}</p>
      <p v-if="author" class="book-header__row"><UIcon name="i-lucide-user" /> {{ author }}</p>
      <div class="book-header__actions">
        <UButton
          v-if="htmlHref"
          :to="htmlHref"
          external
          target="_blank"
          icon="i-lucide-book-open"
          color="neutral"
        >
          Buka versi buku HTML
        </UButton>
        <UButton
          v-if="gutenberg"
          :to="`https://www.gutenberg.org/ebooks/${gutenberg}`"
          external
          target="_blank"
          icon="i-lucide-external-link"
          color="neutral"
          variant="outline"
        >
          Sumber di Gutenberg
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-header {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  margin: 1.5rem 0 2rem;
  padding: 1.25rem;
  border: 1px solid var(--ui-border);
  border-radius: 1rem;
  background: var(--ui-bg-elevated);
}
.book-header__cover {
  flex: none;
  width: 8.5rem;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: .35rem;
  box-shadow: 0 10px 24px -8px rgb(0 0 0 / .6);
}
.book-header__meta { display: flex; flex-direction: column; gap: .5rem; min-width: 0; }
.book-header__row { margin: 0; display: flex; align-items: center; gap: .5rem; color: var(--ui-text-muted); }
.book-header__actions { margin-top: .75rem; display: flex; flex-wrap: wrap; gap: .6rem; }
@media (max-width: 520px) {
  .book-header { flex-direction: column; align-items: center; text-align: center; }
  .book-header__row { justify-content: center; }
  .book-header__actions { justify-content: center; }
}
</style>
