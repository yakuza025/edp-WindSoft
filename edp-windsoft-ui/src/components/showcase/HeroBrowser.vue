<template>
  <section class="hero-side" @mouseenter="$emit('pause')" @mouseleave="$emit('resume')">
    <div
      ref="cardRef"
      class="hero-card"
      :style="{
        '--rx': `${rx}deg`,
        '--ry': `${ry}deg`,
      }"
    >
      <div class="hero-bar">
        <div class="dots"><span></span><span></span><span></span></div>

        <div class="browser-nav">
          <button disabled title="Back">‹</button>
          <button disabled title="Forward">›</button>
          <button title="Refresh" @click="refreshActive">⟳</button>
        </div>

        <div class="address">
          <span class="lock">🔒</span>
          <span class="host">{{ active?.host || '—' }}</span>
          <span class="path">{{ active?.path || '' }}</span>
        </div>

        <span class="live-badge">Live</span>
      </div>

      <div ref="heroStageRef" class="hero-stage">
        <div
          v-for="(s, i) in systems"
          :key="s.id"
          class="frame-wrap"
          :class="{ active: i === current }"
        >
          <div class="frame-viewport">
            <div class="frame-scale">
              <iframe
                :ref="(el) => (iframeRefs[s.id] = el)"
                :src="`https://${s.host}${s.path}`"
                :title="s.name + ' preview'"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                allow="clipboard-read; clipboard-write"
                @load="onIframeLoad(s.id)"
              ></iframe>
            </div>
            <div v-if="frameFailed[s.id] && !loaded[s.id]" class="frame-fallback">
              <div class="frame-fallback__inner">
                <span class="frame-fallback__icon">⚠</span>
                <p class="frame-fallback__title">This demo is taking a while to load</p>
                <p class="frame-fallback__text">
                  The site may be down, or refusing to embed in a frame. You can open it directly:
                </p>
                <a :href="`https://${s.host}${s.path}`" target="_blank" rel="noopener" class="frame-fallback__btn">
                  Open {{ s.name }} in a new tab →
                </a>
              </div>
            </div>
          </div>
          <div class="frame-loader" :class="{ hide: loaded[s.id] }">
            <div class="loader-inner">
              <div class="spinner"></div>
              <div class="loader-label">Loading <b>{{ s.name }}</b>…</div>
            </div>
          </div>
        </div>

        <div class="swipe-hint" :class="{ fade: !hintVisible }">
          ✦ Auto-playing · swipe or use ← →
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, reactive, onUnmounted, watch } from 'vue';
import { useSwipe } from '@/composables/useSwipe';
import { useTilt } from '@/composables/useTilt';

const props = defineProps({
  systems:     { type: Array,   default: () => [] },
  current:     { type: Number,  default: 0 },
  loaded:      { type: Object,  default: () => ({}) },
  hintVisible: { type: Boolean, default: true },
});

const emit = defineEmits([
  'pause', 'resume', 'frameLoad', 'swipeLeft', 'swipeRight', 'dismissHint',
]);

const cardRef      = ref(null);
const heroStageRef = ref(null);
const iframeRefs   = reactive({});

const { rx, ry } = useTilt(cardRef, { max: 2 });

// ── iframe load-timeout fallback ──
const frameTimeouts = reactive({});
const frameFailed = reactive({});

function watchFrameLoad(id) {
  clearTimeout(frameTimeouts[id]);
  frameFailed[id] = false;
  frameTimeouts[id] = setTimeout(() => {
    if (!props.loaded[id]) {
      frameFailed[id] = true;
    }
  }, 12000);
}

function onIframeLoad(id) {
  clearTimeout(frameTimeouts[id]);
  frameFailed[id] = false;
  emit('frameLoad', id);
}

onUnmounted(() => {
  Object.values(frameTimeouts).forEach(clearTimeout);
});

const active = computed(() => props.systems[props.current] || null);

// Start timeout timer whenever the active system changes
watch(
  () => active.value?.id,
  (id) => { if (id) watchFrameLoad(id); },
  { immediate: true }
);

function refreshActive() {
  const id = active.value?.id;
  const el = iframeRefs[id];
  if (!el) return;
  const src = el.src;
  el.src = 'about:blank';
  requestAnimationFrame(() => { el.src = src; });
  emit('frameLoad', id);
}

useSwipe(heroStageRef, {
  onStart: () => emit('dismissHint'),
  onLeft:  () => emit('swipeLeft'),
  onRight: () => emit('swipeRight'),
});
</script>

<style scoped>
.hero-card {
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.3s ease-out, box-shadow 0.3s ease;
}
</style>
