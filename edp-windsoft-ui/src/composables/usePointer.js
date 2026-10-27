import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Normalized, smoothed pointer position (-1..1 in both axes).
 * Blobs use this to parallax the ambient background.
 */
export function usePointer({ ease = 0.06 } = {}) {
  const nx = ref(0);
  const ny = ref(0);
  let tx = 0, ty = 0;
  let raf = 0;

  function step() {
    nx.value += (tx - nx.value) * ease;
    ny.value += (ty - ny.value) * ease;
    if (Math.abs(tx - nx.value) > 0.001 || Math.abs(ty - ny.value) > 0.001) {
      raf = requestAnimationFrame(step);
    }
  }

  function onMove(e) {
    tx = (e.clientX / window.innerWidth) * 2 - 1;
    ty = (e.clientY / window.innerHeight) * 2 - 1;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(step);
  }

  onMounted(() => window.addEventListener('pointermove', onMove, { passive: true }));
  onUnmounted(() => {
    window.removeEventListener('pointermove', onMove);
    cancelAnimationFrame(raf);
  });

  return { nx, ny };
}
