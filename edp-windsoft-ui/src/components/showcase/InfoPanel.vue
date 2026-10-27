<template>
  <aside
    class="info-panel"
    :style="{ '--autoplay-ms': `${autoplayMs}ms` }"
    @mouseenter="$emit('pause')"
    @mouseleave="$emit('resume')"
  >
    <div
      v-for="(s, i) in systems"
      :key="s.id"
      class="info-slide"
      :class="{ active: i === current }"
      :style="{ '--sys-color': s.color || 'var(--accent)' }"
    >
      <div class="info-index">
        <span class="bar"></span>
        System {{ pad(i + 1) }} / {{ pad(systems.length) }}
      </div>

      <div class="info-icon">{{ s.icon }}</div>

      <h1 class="info-title">{{ s.name }}</h1>

      <p class="info-tagline">{{ s.tagline }}</p>

      <div class="info-features">
        <span v-for="f in s.features" :key="f">{{ f }}</span>
      </div>

      <div class="info-host">
        <span class="lock">🔒</span>{{ s.host }}{{ s.path }}
      </div>

      <button class="info-cta" @click="$emit('explore', s)">
        <span>Explore live demo</span>
        <i>→</i>
      </button>
    </div>

    <ProgressRail
      :count="systems.length"
      :current="current"
      :paused="paused"
      :autoplay-ms="autoplayMs"
      @select="$emit('select', $event)"
    />
  </aside>
</template>

<script setup>
import ProgressRail from './ProgressRail.vue';

defineProps({
  systems:    { type: Array,   default: () => [] },
  current:    { type: Number,  default: 0 },
  paused:     { type: Boolean, default: false },
  autoplayMs: { type: Number,  default: 6000 },
});
defineEmits(['pause', 'resume', 'explore', 'select']);

const pad = (n) => String(n).padStart(2, '0');
</script>
