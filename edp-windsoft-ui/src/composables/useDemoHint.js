import { ref, onMounted, onUnmounted } from 'vue';
import { DEFAULTS } from '@/config/app';

export function useDemoHint(timeout = DEFAULTS.HINT_TIMEOUT_MS) {
  const visible = ref(true);
  let timer = null;

  function dismiss() { visible.value = false; }

  onMounted(() => {
    timer = setTimeout(dismiss, timeout);
  });

  onUnmounted(() => {
    clearTimeout(timer);
  });

  return { visible, dismiss };
}
