<template>
  <div
    class="ambient"
    :class="[`ambient--${routeName}`, { 'ambient--static': reduced }]"
    :style="style"
    aria-hidden="true"
  >
    <div class="ambient__base"></div>

    <div class="ambient__blob ambient__blob--a"></div>
    <div class="ambient__blob ambient__blob--b"></div>
    <div class="ambient__blob ambient__blob--c"></div>

    <div class="ambient__grid"></div>
    <div class="ambient__grain"></div>
    <div class="ambient__vignette"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAmbientStore } from '@/stores/ambient';
import { usePointer } from '@/composables/usePointer';
import { useReducedMotion } from '@/composables/useReducedMotion';

const route = useRoute();
const ambient = useAmbientStore();
const reduced = useReducedMotion();
const { nx, ny } = usePointer({ ease: reduced.value ? 1 : 0.06 });

const routeName = computed(() => {
  if (route.name === 'login') return 'login';
  if (route.name === 'admin') return 'admin';
  return 'showcase';
});

const style = computed(() => {
  const s = {
    '--nx': nx.value.toFixed(4),
    '--ny': ny.value.toFixed(4),
    '--amb-intensity': ambient.intensity ?? 1,
  };
  if (ambient.primary)   s['--amb-1'] = ambient.primary;
  if (ambient.secondary) s['--amb-2'] = ambient.secondary;
  return s;
});
</script>

<style scoped>
/* Register animatable color properties */
@property --blob-color-a {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}
@property --blob-color-b {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}

.ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  --nx: 0;
  --ny: 0;

  --amb-1: var(--accent);
  --amb-2: var(--accent-2);
  --amb-intensity: 1;

  --blob-a-color: var(--amb-1);
  --blob-b-color: var(--amb-2);
}

/* Solid base wash */
.ambient__base {
  position: absolute;
  inset: 0;
  background: var(--bg);
}

/* ── Blobs ─────────────────────────────────────────────── */
.ambient__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  will-change: transform;
  transition: --blob-color-a 900ms ease, --blob-color-b 900ms ease;
}

/* Primary blob — moves against cursor (foreground feel) */
.ambient__blob--a {
  --blob-color-a: var(--blob-a-color);
  background: radial-gradient(circle, var(--blob-color-a) 0%, transparent 62%);
  opacity: calc(var(--amb-intensity) * var(--blob-opacity-a, 0.22));
  transform: translate3d(
    calc(var(--nx) * -55px),
    calc(var(--ny) * -55px),
    0
  );
  transition:
    --blob-color-a 900ms ease,
    opacity 500ms ease;
}

/* Secondary blob — moves with cursor (background feel) */
.ambient__blob--b {
  --blob-color-b: var(--blob-b-color);
  background: radial-gradient(circle, var(--blob-color-b) 0%, transparent 62%);
  opacity: calc(var(--amb-intensity) * var(--blob-opacity-b, 0.16));
  transform: translate3d(
    calc(var(--nx) * 80px),
    calc(var(--ny) * 80px),
    0
  );
  transition:
    --blob-color-b 900ms ease,
    opacity 500ms ease;
}

/* Tertiary accent — very subtle, offset direction */
.ambient__blob--c {
  background: radial-gradient(circle, var(--accent-3, #06b6d4) 0%, transparent 62%);
  opacity: calc(var(--amb-intensity) * var(--blob-opacity-c, 0.1));
  transform: translate3d(
    calc(var(--nx) * 35px),
    calc(var(--ny) * -35px),
    0
  );
}

/* ── Route variants ────────────────────────────────────── */
.ambient--showcase .ambient__blob--a {
  width: 900px; height: 900px;
  top: -280px;
  right: -260px;
}
.ambient--showcase .ambient__blob--b {
  width: 750px; height: 750px;
  bottom: -280px;
  left: 8%;
}
.ambient--showcase .ambient__blob--c {
  width: 520px; height: 520px;
  top: 45%;
  left: 35%;
}

.ambient--login .ambient__blob--a {
  width: 850px; height: 850px;
  top: -320px;
  left: calc(50% - 425px);
}
.ambient--login .ambient__blob--b {
  width: 750px; height: 750px;
  bottom: -300px;
  right: -180px;
}
.ambient--login .ambient__blob--c {
  display: none;
}

.ambient--admin .ambient__blob--a {
  width: 650px; height: 650px;
  top: -180px;
  left: -140px;
}
.ambient--admin .ambient__blob--b {
  width: 520px; height: 520px;
  top: -120px;
  right: -120px;
}
.ambient--admin .ambient__blob--c {
  display: none;
}

/* ── Grid overlay ──────────────────────────────────────── */
.ambient__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--amb-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--amb-grid-line) 1px, transparent 1px);
  background-size: 64px 64px;
  background-position: -1px -1px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 80%);
}

/* ── Film grain ────────────────────────────────────────── */
.ambient__grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.42 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: var(--amb-grain-opacity, 0.04);
  mix-blend-mode: var(--amb-grain-blend, multiply);
}

/* ── Vignette ──────────────────────────────────────────── */
.ambient__vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 60% at 50% 0%, var(--amb-vignette-top, transparent), transparent 70%),
    radial-gradient(ellipse 100% 40% at 50% 100%, var(--amb-vignette-bottom, transparent), transparent 70%);
}

/* ── Reduced motion ────────────────────────────────────── */
.ambient--static .ambient__blob {
  transform: none !important;
  transition: none !important;
}
@media (prefers-reduced-motion: reduce) {
  .ambient__blob { transform: none !important; }
}
</style>
