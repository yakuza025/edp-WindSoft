<template>
  <div class="lg">
    <button
      class="theme-toggle theme-toggle--floating"
      :aria-label="`Switch to ${theme.isDark ? 'light' : 'dark'} mode`"
      @click="theme.toggle()"
    >
      <Transition name="icon-swap" mode="out-in">
        <svg v-if="theme.isDark" key="sun" width="15" height="15" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg v-else key="moon" width="15" height="15" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </Transition>
    </button>

    <div class="lg-card">
      <div class="lg-brand">
        <div class="lg-mark">W</div>
        <div>
          <h1>WindSoft Console</h1>
          <p>Sign in to manage the catalog</p>
        </div>
      </div>

      <form @submit.prevent="submit">
        <label class="lg-field">
          <span>Admin key</span>
          <input
            v-model="keyInput"
            type="password"
            placeholder="X-Admin-Key"
            required
            autofocus
          />
        </label>
        <div v-if="error" class="lg-error">{{ error }}</div>
        <button class="lg-submit" :disabled="loading">
          {{ loading ? 'Verifying…' : 'Sign in' }}
        </button>
      </form>

      <router-link to="/" class="lg-back">← Back to showcase</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';

const router  = useRouter();
const route   = useRoute();
const auth    = useAuthStore();
const theme   = useThemeStore();
const keyInput = ref('');
const loading  = ref(false);
const error    = ref('');

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(keyInput.value);
    router.push(route.query.redirect || '/admin');
  } catch (e) {
    error.value = e.message || 'Invalid key';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.lg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.lg-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem 1.75rem;
  background: color-mix(in srgb, var(--surface) 90%, transparent);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}
.lg-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--accent) 50%, transparent),
    transparent
  );
  pointer-events: none;
  border-radius: inherit;
}
.lg-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.75rem;
}
.lg-mark {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--accent-fg);
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow:
    var(--shadow-sm),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.lg-brand h1 {
  font-size: var(--t-md);
  font-weight: 700;
  color: var(--text);
  margin: 0;
}
.lg-brand p {
  font-size: var(--t-xs);
  color: var(--text-muted);
  margin: 0.1rem 0 0;
}
.lg-field { display: flex; flex-direction: column; gap: 0.4rem; }
.lg-field span {
  font-size: var(--t-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.lg-field input {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.85rem;
  color: var(--text);
  font-family: inherit;
  font-size: var(--t-base);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.lg-field input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-ring);
}
.lg-error {
  padding: 0.55rem 0.8rem;
  background: var(--danger-bg);
  border: 1px solid var(--danger-border);
  border-radius: var(--radius-sm);
  color: var(--danger);
  font-size: var(--t-sm);
}
.lg-submit {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: var(--accent-fg);
  border: 0;
  font-weight: 600;
  font-size: var(--t-base);
  cursor: pointer;
  box-shadow:
    var(--shadow-sm),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.15s;
}
.lg-submit:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow:
    var(--shadow-md),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.lg-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.lg-back {
  text-align: center;
  font-size: var(--t-sm);
  color: var(--text-muted);
  margin-top: 0.4rem;
}
.lg-back:hover { color: var(--text); }
</style>
