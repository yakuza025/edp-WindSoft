import { ref, watch, onMounted, onUnmounted } from 'vue';

export function useAutoplay({ items, ms = 6000 }) {
  const current = ref(0);
  const paused  = ref(false);
  let timer = null;

  function getMs() {
    if (typeof ms === 'function') return Number(ms());
    if (ms?.value !== undefined)  return Number(ms.value);
    return Number(ms);
  }

  function schedule() {
    clearTimeout(timer);
    if (paused.value || items.value.length <= 1) return;

    timer = setTimeout(() => {
      if (items.value.length > 0) {
        current.value = (current.value + 1) % items.value.length;
        schedule();
      }
    }, getMs());
  }

  function next() {
    if (!items.value.length) return;
    current.value = (current.value + 1) % items.value.length;
    schedule();
  }

  function prev() {
    if (!items.value.length) return;
    current.value = (current.value - 1 + items.value.length) % items.value.length;
    schedule();
  }

  function activate(index) {
    if (index < 0 || index >= items.value.length) return;
    current.value = index;
    schedule();
  }

  function pause() {
    paused.value = true;
    clearTimeout(timer);
  }

  function resume() {
    paused.value = false;
    schedule();
  }

  function stop() {
    clearTimeout(timer);
  }

  // Auto-start whenever items arrive or change
  watch(
    () => items.value.length,
    (len) => { if (len > 0) schedule(); },
  );

  onMounted(() => {
  schedule();

  // Pause when tab is hidden
  const onVis = () => {
    if (document.hidden) stop();
    else if (!paused.value) schedule();
  };
  document.addEventListener('visibilitychange', onVis);

  // Store cleanup
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', onVis);
  });
});
  onUnmounted(stop);

  return { current, paused, next, prev, activate, pause, resume, stop };
}
