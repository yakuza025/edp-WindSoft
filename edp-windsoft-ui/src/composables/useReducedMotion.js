import { ref, onMounted, onUnmounted } from 'vue';

export function useReducedMotion() {
  const reduced = ref(false);
  let mq;
  const handler = (e) => { reduced.value = e.matches; };

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduced.value = mq.matches;
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  });

  onUnmounted(() => {
    if (!mq) return;
    if (mq.removeEventListener) mq.removeEventListener('change', handler);
    else if (mq.removeListener) mq.removeListener(handler);
  });

  return reduced;
}
