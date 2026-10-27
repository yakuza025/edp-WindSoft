<template>
  <div class="lang-switch" role="group" aria-label="Language">
    <button
      v-for="l in langs"
      :key="l.code"
      type="button"
      class="lang-switch__btn"
      :class="{ 'is-active': current === l.code }"
      :title="l.label"
      @click="change(l.code)"
    >
      {{ l.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { setLocale } from '@/i18n';

const { locale } = useI18n();
const current = computed(() => locale.value);

const langs = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

function change(code) {
  if (code === current.value) return;
  setLocale(code);
}
</script>

<style scoped>
.lang-switch {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: var(--r-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
}
.lang-switch__btn {
  padding: .28rem .5rem;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--text-3);
  font-family: var(--mono);
  font-size: .65rem;
  font-weight: 600;
  letter-spacing: .04em;
  cursor: pointer;
  transition: background .12s, color .12s;
}
.lang-switch__btn:hover {
  color: var(--text);
}
.lang-switch__btn.is-active {
  background: var(--surface);
  color: var(--accent);
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
}
</style>
