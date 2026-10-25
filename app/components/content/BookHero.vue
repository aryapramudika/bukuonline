<script setup lang="ts">
import { withBase } from 'ufo'

interface Item { cover: string, to: string, title: string }

const props = defineProps<{
  title: string
  description: string
  books: Item[]
  startTo: string
  stats?: { label: string, value: string | number }[]
}>()

const base = useRuntimeConfig().app.baseURL
const src = (p: string) => withBase(p, base)
// Tumpukan sampul: tinggi dan putaran berbeda agar terlihat seperti rak yang ditata santai.
const tilt = (i: number) => ((i % 5) - 2) * 2.2
const lift = (i: number) => [0, 14, 4, 18, 8][i % 5]
</script>

<template>
  <section class="hero">
    <div class="hero__text">
      <p class="hero__eyebrow">Perpustakaan terjemahan</p>
      <h1 class="hero__title">{{ title }}</h1>
      <p class="hero__desc">{{ description }}</p>
      <div class="hero__actions">
        <UButton :to="startTo" size="xl" color="neutral" trailing-icon="i-lucide-arrow-right">
          Mulai membaca
        </UButton>
        <UButton to="#daftar-buku" size="xl" color="neutral" variant="outline">
          Lihat semua buku
        </UButton>
      </div>
      <dl v-if="stats?.length" class="hero__stats">
        <div v-for="s in stats" :key="s.label">
          <dt>{{ s.label }}</dt>
          <dd>{{ s.value }}</dd>
        </div>
      </dl>
    </div>

    <div class="hero__shelf" aria-label="Sampul buku">
      <NuxtLink
        v-for="(b, i) in props.books"
        :key="b.to"
        :to="b.to"
        class="hero__book"
        :title="b.title"
        :style="{ '--tilt': `${tilt(i)}deg`, '--lift': `${lift(i)}px` }"
      >
        <img :src="src(b.cover)" :alt="`Sampul ${b.title}`">
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 3.5rem 0 2.5rem;
  display: grid;
  gap: 3rem;
  text-align: center;
}
.hero::before {
  content: '';
  position: absolute;
  inset: -4rem auto auto 50%;
  width: 100vw;
  transform: translateX(-50%);
  height: 26rem;
  z-index: -1;
  background: radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--ui-primary) 22%, transparent), transparent 70%);
  pointer-events: none;
}
.hero__eyebrow {
  margin: 0 0 .75rem;
  font-size: .8rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ui-primary);
  font-weight: 600;
}
.hero__title {
  margin: 0;
  font-size: clamp(2.6rem, 7vw, 4.5rem);
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -.02em;
}
.hero__desc {
  max-width: 38rem;
  margin: 1.1rem auto 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--ui-text-muted);
}
.hero__actions {
  margin-top: 1.75rem;
  display: flex;
  gap: .75rem;
  flex-wrap: wrap;
  justify-content: center;
}
.hero__stats {
  margin: 2rem 0 0;
  display: flex;
  gap: 2.5rem;
  justify-content: center;
}
.hero__stats dt { font-size: .75rem; color: var(--ui-text-muted); text-transform: uppercase; letter-spacing: .08em; }
.hero__stats dd { margin: .15rem 0 0; font-size: 1.6rem; font-weight: 700; }

.hero__shelf {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 1rem .5rem 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.hero__shelf::-webkit-scrollbar { display: none; }
.hero__book {
  flex: none;
  width: clamp(4.25rem, 9vw, 8rem);
  margin: 0 -.3rem;
  transform: translateY(calc(var(--lift) * -1)) rotate(var(--tilt));
  transition: transform .25s ease, z-index 0s;
  filter: drop-shadow(0 14px 18px rgb(0 0 0 / .45));
}
.hero__book img {
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: .3rem;
}
.hero__book:hover {
  transform: translateY(-1.4rem) rotate(0deg) scale(1.08);
  z-index: 2;
}
@media (max-width: 700px) {
  .hero__shelf { justify-content: flex-start; }
  .hero__stats { gap: 1.5rem; }
}
</style>

<style>
/* Latar sorotan hero memakai lebar layar penuh; cegah gulir horizontal. */
html, body { overflow-x: clip; }
</style>
