<template>
  <TopBar
    :brand-name="settings.brandName"
    :brand-subtitle="settings.brandSubtitle"
    :paused="false"
  />

  <div v-if="loading" class="sd sd--loading">
    <div class="sd__spinner">Loading solution…</div>
  </div>

  <div v-else-if="error" class="sd sd--error">
    <div class="sd__error-card">
      <h1>Solution not found</h1>
      <p>{{ error }}</p>
      <router-link to="/" class="sd__btn">← Back to showcase</router-link>
    </div>
  </div>

  <article v-else-if="solution" class="sd" :style="{ '--c': solution.color || 'var(--accent)' }">
    <nav class="sd__crumbs">
      <router-link to="/">Home</router-link>
      <span class="sd__sep">/</span>
      <router-link to="/#solutions">Solutions</router-link>
      <span class="sd__sep">/</span>
      <span class="sd__crumb-current">{{ solution.title }}</span>
    </nav>

    <header class="sd__head">
      <div class="sd__icon">{{ solution.icon }}</div>
      <div class="sd__head-body">
        <span v-if="solution.category" class="sd__cat">{{ solution.category }}</span>
        <h1 class="sd__title">{{ solution.title }}</h1>
        <p v-if="solution.subtitle" class="sd__sub">{{ solution.subtitle }}</p>
      </div>
    </header>

    <div class="sd__grid">
      <main class="sd__main">
        <p class="sd__desc">{{ solution.description }}</p>

        <section v-if="solution.features?.length" class="sd__features">
          <h2 class="sd__section-title">What's included</h2>
          <ul class="sd__feature-list">
            <li v-for="f in solution.features" :key="f">
              <span class="sd__check">✓</span>{{ f }}
            </li>
          </ul>
        </section>
      </main>

      <aside class="sd__aside">
        <div class="sd__card">
          <h2 class="sd__card-title">Request a demo</h2>
          <p class="sd__card-desc">
            Want a walkthrough of {{ solution.title }} with your own data?
            We will set up a sandbox environment within 24 hours.
          </p>
          <router-link to="/#contact" class="sd__cta">
            Contact us <span class="sd__arrow">→</span>
          </router-link>
          <router-link to="/" class="sd__back">← Back to showcase</router-link>
        </div>
      </aside>
    </div>
  </article>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TopBar from '@/components/showcase/TopBar.vue';
import * as solutionsSvc from '@/services/solutions.service';
import { useSettingsStore } from '@/stores/settings';

const route = useRoute();
const settings = useSettingsStore();

const solution = ref(null);
const loading = ref(true);
const error = ref('');

async function load(slug) {
  loading.value = true;
  error.value = '';
  solution.value = null;
  try {
    solution.value = await solutionsSvc.getBySlug(slug);
    // Update document title + meta description
    if (solution.value) {
      document.title = `${solution.value.title} — ${settings.brandName || 'WindSoft'}`;
      const md = document.querySelector('meta[name="description"]');
      if (md && solution.value.subtitle) md.setAttribute('content', solution.value.subtitle);
    }
  } catch (e) {
    error.value = e.message || 'Could not load solution.';
  } finally {
    loading.value = false;
  }
}

watch(() => route.params.slug, (s) => { if (s) load(s); }, { immediate: true });

onMounted(() => {
  if (!Object.keys(settings.data).length) {
    settings.load().catch(() => {});
  }
});
</script>

<style scoped>
.sd {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}
.sd--loading,
.sd--error {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sd__spinner {
  font-family: var(--mono);
  color: var(--text-3);
  font-size: .85rem;
}
.sd__error-card {
  text-align: center;
  padding: 2.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow);
}
.sd__error-card h1 {
  color: var(--text);
  margin-bottom: .75rem;
}
.sd__error-card p {
  color: var(--text-2);
  margin-bottom: 1.25rem;
}
.sd__btn {
  display: inline-flex;
  align-items: center;
  padding: .65rem 1.1rem;
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: var(--r-md);
  text-decoration: none;
  font-weight: 500;
  font-size: .88rem;
}
.sd__crumbs {
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-bottom: 2rem;
  font-size: .8rem;
  color: var(--text-3);
  flex-wrap: wrap;
}
.sd__crumbs a { color: var(--text-2); text-decoration: none; }
.sd__crumbs a:hover { color: var(--accent); }
.sd__sep { color: var(--text-3); }
.sd__crumb-current { color: var(--text); }

.sd__head {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}
.sd__icon {
  width: 72px;
  height: 72px;
  border-radius: var(--r-md);
  display: grid;
  place-items: center;
  font-size: 2rem;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--c) 14%, var(--surface-2));
  border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
  color: var(--c);
}
.sd__head-body { flex: 1; min-width: 0; }
.sd__cat {
  display: inline-block;
  padding: .22rem .6rem;
  border-radius: var(--r-pill);
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-2);
  font-size: .72rem;
  font-weight: 500;
  margin-bottom: .5rem;
}
.sd__title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 600;
  letter-spacing: -.02em;
  color: var(--text);
  margin: 0 0 .35rem;
  line-height: 1.15;
}
.sd__sub {
  font-size: 1rem;
  color: var(--text-2);
  margin: 0;
  line-height: 1.5;
}

.sd__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
  gap: 2.5rem;
  align-items: start;
}
@media (max-width: 900px) {
  .sd__grid { grid-template-columns: 1fr; gap: 2rem; }
}

.sd__desc {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-2);
  margin: 0 0 2rem;
}
.sd__features {}
.sd__section-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 1rem;
}
.sd__feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
.sd__feature-list li {
  display: flex;
  align-items: baseline;
  gap: .6rem;
  padding: .6rem .8rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  font-size: .9rem;
  color: var(--text-2);
}
.sd__check {
  color: var(--c);
  font-weight: 700;
  flex-shrink: 0;
}

.sd__aside {}
.sd__card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: .75rem;
}
.sd__card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}
.sd__card-desc {
  font-size: .88rem;
  line-height: 1.6;
  color: var(--text-2);
  margin: 0;
}
.sd__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  padding: .7rem 1.1rem;
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: var(--r-md);
  text-decoration: none;
  font-weight: 500;
  font-size: .9rem;
  transition: filter .15s;
}
.sd__cta:hover { filter: brightness(1.08); color: var(--accent-ink); }
.sd__arrow { transition: transform .15s; }
.sd__cta:hover .sd__arrow { transform: translateX(3px); }
.sd__back {
  text-align: center;
  font-size: .82rem;
  color: var(--text-3);
  text-decoration: none;
}
.sd__back:hover { color: var(--text); }
</style>
