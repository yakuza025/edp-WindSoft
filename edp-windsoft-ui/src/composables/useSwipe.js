import { onMounted, onUnmounted } from 'vue';
import { DEFAULTS } from '@/config/app';

export function useSwipe(elRef, {
  onStart,
  onLeft,
  onRight,
  threshold = DEFAULTS.SWIPE_THRESHOLD_PX,
} = {}) {
  let startX = 0;
  let startY = 0;
  let swiping = false;
  let delta = 0;

  function begin(e) {
    if (e.button !== undefined && e.button !== 0) return;
    const t = e.touches?.[0] || e;
    startX = t.clientX;
    startY = t.clientY;
    swiping = true;
    delta = 0;
    onStart?.();

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', end);
  }

  function move(e) {
    if (!swiping) return;
    const t = e.touches?.[0] || e;
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > Math.abs(dy)) delta = dx;
  }

  function end() {
    if (!swiping) return;
    swiping = false;

    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', end);
    window.removeEventListener('touchmove', move);
    window.removeEventListener('touchend', end);

    if (delta < -threshold) onLeft?.();
    else if (delta > threshold) onRight?.();
  }

  onMounted(() => {
    const el = elRef.value;
    if (!el) return;
    el.addEventListener('mousedown', begin);
    el.addEventListener('touchstart', begin, { passive: true });
  });

  onUnmounted(() => {
    const el = elRef.value;
    if (el) {
      el.removeEventListener('mousedown', begin);
      el.removeEventListener('touchstart', begin);
    }
    end();
  });
}
