<template>
  <section id="solutions" ref="elRef" class="sol-section" :class="{ 'is-in': revealed }">
    <header class="sol-section__head">
      <div class="sol-section__eyebrow">
        <span class="sol-section__num">§</span>
        <span>Catalogue of solutions</span>
      </div>
      <h2 class="sol-section__title">
        A small collection of <em>considered</em> products.
      </h2>
      <p class="sol-section__lede">
        Each one solves a specific, unglamorous problem for teams that have to get real work done.
        Pick the one that fits — or ask us to tailor something that does.
      </p>
    </header>

    <!-- Filter pills -->
    <div v-if="categories.length > 1" class="sol-filters" role="tablist" aria-label="Filter solutions by category">
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        role="tab"
        class="sol-filter"
        :class="{ 'is-active': activeCategory === cat }"
        :aria-selected="activeCategory === cat"
        @click="activeCategory = cat"
      >
        {{ cat }}
        <span v-if="cat !== 'All'" class="sol-filter__count">
          {{ countByCategory(cat) }}
        </span>
      </button>
    </div>

    <!-- Loading skeletons -->
    <div v-if="store.loading && !store.list.length" class="sol-grid sol-grid--skeleton" aria-busy="true" aria-live="polite">
      <div v-for="i in 4" :key="i" class="sol sol--skeleton">
        <div class="sol__skel sol__skel--sm"></div>
        <div class="sol__skel sol__skel--lg"></div>
        <div class="sol__skel sol__skel--md"></div>
        <div class="sol__skel sol__skel--sm"></div>
        <div class="sol__skel sol__skel--md"></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="store.error" class="sol-section__error" role="alert">
      <p class="sol-section__error-title">Could not load solutions.</p>
      <p class="sol-section__error-msg">{{ store.error }}</p>
      <button type="button" class="sol-section__retry" @click="retry">
        <span>↻</span> Try again
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!store.list.length" class="sol-section__empty">
      No solutions published yet.
    </div>

    <!-- Filter-empty -->
    <div v-else-if="!filteredList.length" class="sol-section__empty">
      No solutions in <strong>{{ activeCategory }}</strong> yet.
      <button type="button" class="sol-section__reset" @click="activeCategory = 'All'">Show all</button>
    </div>

    <!-- Grid -->
    <div v-else class="sol-grid">
      <article
        v-for="(s, i) in filteredList"
        :key="`${activeCategory}-${s.id}`"
        class="sol"
        :class="cardClass(i)"
        :style="{ '--d': `${i * 70}ms`, '--c': s.color }"
      >
        <span class="sol__num">{{ pad(i + 1) }}</span>

        <header class="sol__head">
          <span class="sol__icon">{{ s.icon }}</span>
          <span v-if="s.category" class="sol__cat">{{ s.category }}</span>
        </header>

        <h3 class="sol__title">{{ s.title }}</h3>
        <p v-if="s.subtitle" class="sol__sub">{{ s.subtitle }}</p>
        <p class="sol__desc">{{ s.description }}</p>

        <ul v-if="s.features?.length" class="sol__features">
          <li v-for="f in s.features.slice(0, 6)" :key="f">{{ f }}</li>
        </ul>

        <router-link :to="`/solutions/${s.slug}`" class="sol__cta">
          <span>{{ s.cta_label || 'Learn more' }}</span>
          <span class="sol__arrow">→</span>
        </router-link>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useReveal } from '@/composables/useReveal';

const props = defineProps({
  store: { type: Object, required: true },
});

const { elRef, revealed } = useReveal();
const pad = (n) => String(n).padStart(2, '0');

const activeCategory = ref('All');

const categories = computed(() => {
  const set = new Set();
  (props.store.list || []).forEach((s) => { if (s.category) set.add(s.category); });
  return set.size > 0 ? ['All', ...Array.from(set).sort()] : [];
});

const filteredList = computed(() => {
  const list = props.store.list || [];
  if (activeCategory.value === 'All') return list;
  return list.filter((s) => s.category === activeCategory.value);
});

function countByCategory(cat) {
  return (props.store.list || []).filter((s) => s.category === cat).length;
}

async function retry() {
  try {
    if (typeof props.store.loadPublic === 'function') await props.store.loadPublic();
  } catch { /* surfaced in store.error */ }
}

function cardClass(i) {
  if (i === 0) return 'sol--feat';
  if (i % 5 === 4) return 'sol--wide';
  return '';
}
</script>
