<template>
  <TopBar
    :brand-name="settings.brandName"
    :brand-subtitle="settings.brandSubtitle"
    :paused="isPaused"
    :active-section="activeSection"
  />

  <div v-if="!systemsStore.loading && !systemsStore.list.length" class="empty-shell">
    <div class="empty-shell__icon">◌</div>
    <h1 class="empty-shell__title">No systems yet</h1>
    <p class="empty-shell__text">Sign in to the admin panel to add your first demo system.</p>
    <router-link to="/login" class="empty-shell__link">Open the console →</router-link>
  </div>

  <template v-else-if="systemsStore.list.length">
    <div id="showcase" class="layout">
      <InfoPanel
        :systems="systemsStore.list"
        :current="current"
        :paused="isPaused"
        :autoplay-ms="settings.autoplayMs"
        @pause="pause"
        @resume="resume"
        @select="activate"
        @explore="exploreSystem"
      />
      <HeroBrowser
        :systems="systemsStore.list"
        :current="current"
        :loaded="loaded"
        :hint-visible="hintVisible"
        @pause="pause"
        @resume="resume"
        @frame-load="onFrameLoad"
        @swipe-left="next"
        @swipe-right="prev"
        @dismiss-hint="dismissHint"
      />
    </div>

    
    <ManifestoSection :content="siteContent.data" />
    <SolutionsSection :store="solutionsStore" />
    <FaqSection />
    <ContactSection :content="siteContent.data" />
  </template>
</template>

<script setup>
import { reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { useSystemsStore } from '@/stores/systems';
import { useSettingsStore } from '@/stores/settings';
import { useSolutionsStore } from '@/stores/solutions';
import { useSiteContentStore } from '@/stores/siteContent';
import { useAmbientStore, deriveSecondary } from '@/stores/ambient';
import { useAutoplay } from '@/composables/useAutoplay';
import { useDemoHint } from '@/composables/useDemoHint';
import { useActiveSection } from '@/composables/useActiveSection';
import TopBar from '@/components/showcase/TopBar.vue';
import InfoPanel from '@/components/showcase/InfoPanel.vue';
import HeroBrowser from '@/components/showcase/HeroBrowser.vue';
import ManifestoSection from '@/components/showcase/ManifestoSection.vue';
import SolutionsSection from '@/components/showcase/SolutionsSection.vue';
import ContactSection from '@/components/showcase/ContactSection.vue';
import FaqSection from '@/components/showcase/FaqSection.vue';

const systemsStore   = useSystemsStore();
const settings       = useSettingsStore();
const solutionsStore = useSolutionsStore();
const siteContent    = useSiteContentStore();
const ambient        = useAmbientStore();
const loaded         = reactive({});

const {
  current, paused: isPaused, next, prev, pause, resume, activate,
} = useAutoplay({
  items: computed(() => systemsStore.list),
  ms: () => settings.autoplayMs,
});

const { visible: hintVisible, dismiss: dismissHint } = useDemoHint();

const activeSection = useActiveSection(['showcase', 'solutions', 'contact']);

watch(
  () => [current.value, systemsStore.list.length],
  () => {
    const s = systemsStore.list[current.value];
    if (!s) return;
    ambient.set({
      primary: s.color || null,
      secondary: s.color ? deriveSecondary(s.color) : null,
      intensity: 1,
    });
  },
  { immediate: true },
);

function onFrameLoad(id) { loaded[id] = true; }
function exploreSystem(s) {
  if (s) window.open(`https://${s.host}${s.path}`, '_blank', 'noopener');
}
function onKey(e) {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft')  prev();
}

onMounted(async () => {
  document.addEventListener('keydown', onKey);
  await Promise.allSettled([
    systemsStore.loadPublic(),
    settings.load(),
    solutionsStore.loadPublic(),
    siteContent.load(),
  ]);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKey);
  ambient.reset();
});
</script>
