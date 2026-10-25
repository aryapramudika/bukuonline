<script setup lang="ts">
import { withBase } from 'ufo'

const props = defineProps<{
  title: string
  author?: string
  cover: string
  to: string
  desc?: string
}>()

const base = useRuntimeConfig().app.baseURL
const coverSrc = computed(() => withBase(props.cover, base))
</script>

<template>
  <NuxtLink :to="to" class="book-card">
    <div class="book-card__cover">
      <img :src="coverSrc" :alt="`Sampul ${title}`" loading="lazy">
    </div>
    <div class="book-card__body">
      <h3 class="book-card__title">{{ title }}</h3>
      <p v-if="author" class="book-card__author">{{ author }}</p>
      <p v-if="desc" class="book-card__desc">{{ desc }}</p>
      <span class="book-card__cta">Baca buku <UIcon name="i-lucide-arrow-right" /></span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.book-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.1rem;
  border: 1px solid var(--ui-border);
  border-radius: 1rem;
  background: var(--ui-bg-elevated);
  text-decoration: none;
  color: inherit;
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
}
.book-card:hover {
  transform: translateY(-3px);
  border-color: var(--ui-primary);
  box-shadow: 0 12px 30px -12px rgb(0 0 0 / .45);
}
.book-card__cover {
  flex: none;
  width: 7.5rem;
}
.book-card__cover img {
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: .35rem;
  box-shadow: 0 8px 20px -6px rgb(0 0 0 / .55);
}
.book-card__body { display: flex; flex-direction: column; min-width: 0; }
.book-card__title { margin: 0; font-size: 1.05rem; line-height: 1.3; font-weight: 600; }
.book-card__author { margin: .25rem 0 0; font-size: .85rem; color: var(--ui-primary); }
.book-card__desc {
  margin: .5rem 0 0;
  font-size: .85rem;
  line-height: 1.5;
  color: var(--ui-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.book-card__cta {
  margin-top: auto;
  padding-top: .75rem;
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  font-size: .85rem;
  font-weight: 500;
  color: var(--ui-primary);
}
@media (max-width: 480px) {
  .book-card__cover { width: 5.5rem; }
}
</style>
