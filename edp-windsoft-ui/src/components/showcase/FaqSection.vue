<template>
  <section v-if="store.loading || store.list.length || store.error" ref="elRef" class="faq" :class="{ 'is-in': revealed }">
    <header class="faq__head">
      <div class="faq__eyebrow">
        <span class="faq__num">§</span>
        <span>Questions &amp; answers</span>
      </div>
      <h2 class="faq__title">Things people <em>usually</em> want to know.</h2>
      <p class="faq__lede">
        If your question is not covered here, drop us a line in the contact form below — we answer within 4 business hours.
      </p>
    </header>

    <div v-if="store.loading && !store.list.length" class="faq__loading">Loading…</div>

    <div v-else-if="store.error" class="faq__error">
      Could not load FAQ. <button type="button" class="faq__retry" @click="reload">Retry</button>
    </div>

    <ul v-else class="faq__list">
      <li
        v-for="(item, i) in store.list"
        :key="item.id"
        class="faq__item"
        :class="{ 'is-open': openId === item.id }"
        :style="{ '--d': `${i * 40}ms` }"
      >
        <button
          type="button"
          class="faq__q"
          :aria-expanded="openId === item.id"
          :aria-controls="`faq-a-${item.id}`"
          @click="toggle(item.id)"
        >
          <span class="faq__qnum">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="faq__qtext">{{ item.question }}</span>
          <span class="faq__chev" aria-hidden="true">+</span>
        </button>
        <div
          :id="`faq-a-${item.id}`"
          class="faq__a"
          :hidden="openId !== item.id"
        >
          <div class="faq__a-inner">{{ item.answer }}</div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFaqStore } from '@/stores/faq';
import { useReveal } from '@/composables/useReveal';

const store = useFaqStore();
const { elRef, revealed } = useReveal();
const openId = ref(null);

function toggle(id) {
  openId.value = openId.value === id ? null : id;
}

async function reload() {
  try { await store.loadPublic(); } catch { /* surfaced in store.error */ }
}

onMounted(() => {
  if (!store.list.length) store.loadPublic().catch(() => {});
});
</script>

<style scoped>
.faq {
  position: relative;
  z-index: 1;
  padding: 4rem 1.5rem 4rem;
  max-width: 1000px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity .7s var(--ease), transform .7s var(--ease);
}
.faq.is-in { opacity: 1; transform: none; }

.faq__head { max-width: 720px; margin-bottom: 2.5rem; }
.faq__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  margin-bottom: 1rem;
  font-family: var(--mono);
  font-size: .74rem;
  font-weight: 500;
  color: var(--accent);
  letter-spacing: .02em;
}
.faq__num { color: var(--accent); font-weight: 600; }
.faq__title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 600;
  letter-spacing: -.02em;
  line-height: 1.15;
  color: var(--text);
  margin-bottom: 1rem;
}
.faq__title em { font-style: normal; color: var(--accent); }
.faq__lede {
  margin: 0;
  font-size: .95rem;
  line-height: 1.65;
  color: var(--text-2);
  max-width: 55ch;
}

.faq__loading,
.faq__error {
  padding: 2rem;
  text-align: center;
  color: var(--text-3);
  font-size: .88rem;
  background: var(--surface);
  border: 1px dashed var(--border-strong);
  border-radius: var(--r-md);
}
.faq__retry {
  margin-left: .5rem;
  padding: .25rem .65rem;
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
  border-radius: var(--r-sm);
  color: var(--accent);
  font-family: inherit;
  font-size: .8rem;
  cursor: pointer;
}
.faq__retry:hover { background: var(--accent); color: var(--accent-ink); }

.faq__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
.faq__item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  transition: border-color .2s, box-shadow .2s;
}
.faq__item.is-open {
  border-color: var(--accent-line);
  box-shadow: var(--shadow);
}
.faq__q {
  width: 100%;
  display: flex;
  align-items: center;
  gap: .9rem;
  padding: 1.1rem 1.25rem;
  background: transparent;
  border: 0;
  color: var(--text);
  font-family: inherit;
  font-size: .95rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background .15s;
}
.faq__q:hover { background: var(--surface-2); }
.faq__qnum {
  font-family: var(--mono);
  font-size: .72rem;
  font-weight: 500;
  color: var(--text-3);
  flex-shrink: 0;
}
.faq__item.is-open .faq__qnum { color: var(--accent); }
.faq__qtext { flex: 1; }
.faq__chev {
  font-family: var(--mono);
  font-size: 1.15rem;
  font-weight: 400;
  color: var(--text-3);
  transition: transform .25s var(--ease), color .2s;
  flex-shrink: 0;
}
.faq__item.is-open .faq__chev {
  transform: rotate(45deg);
  color: var(--accent);
}
.faq__a {
  border-top: 1px solid var(--border);
}
.faq__a-inner {
  padding: 1rem 1.25rem 1.15rem 3rem;
  font-size: .9rem;
  line-height: 1.7;
  color: var(--text-2);
}
@media (max-width: 640px) {
  .faq__a-inner { padding-left: 1.25rem; }
}
</style>
