<template>
  <header class="topbar">
    <router-link to="/" class="topbar__brand" aria-label="Home">
      <div class="logo">W</div>
      <div class="brand">
        <strong>{{ brandName }}</strong>
        <small>{{ brandSubtitle }}</small>
      </div>
    </router-link>

    <nav class="topbar__sections" aria-label="Page sections">
      <a
        v-for="sec in sections"
        :key="sec.id"
        :href="`#${sec.id}`"
        class="topbar__section"
        :class="{ 'is-active': activeSection === sec.id }"
        :title="sec.label"
      >
        <span class="topbar__section-num">{{ sec.short }}</span>
        <span class="topbar__section-label">{{ sec.label }}</span>
      </a>
    </nav>

    <div class="spacer"></div>

    <button
      class="theme-toggle"
      :aria-label="`Switch to ${theme.isDark ? 'light' : 'dark'} mode`"
      :title="`Switch to ${theme.isDark ? 'light' : 'dark'} mode`"
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

    <span class="autoplay-pill" :class="{ paused }">
      {{ paused ? 'Paused' : 'Auto-cycling' }}
    </span>

    <router-link to="/admin" class="topbar__manage" title="Manage catalog">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
      Manage
    </router-link>
  </header>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme';

const props = defineProps({
  brandName:     { type: String,  default: 'WindSoft Solutions' },
  brandSubtitle: { type: String,  default: 'Product Demo Showcase' },
  paused:        { type: Boolean, default: false },
  activeSection: { type: String,  default: 'showcase' },
});

const theme = useThemeStore();

const sections = [
  { id: 'showcase', short: '01', label: 'Showcase' },
  { id: 'solutions', short: '02', label: 'Solutions' },
  { id: 'contact',   short: '03', label: 'Contact' },
];
</script>
