import { ref, onMounted, onUnmounted } from 'vue';

export function useTilt(elRef, { max = 6, scale = 1.01, ease = 0.15 } = {}) {
  const rx = ref(0);
  const ry = ref(0);
  const mx = ref(50);
  const my = ref(50);
  const hovered = ref(false);

  let targetRx = 0, targetRy = 0, raf = 0;

  function loop() {
    rx.value += (targetRx - rx.value) * ease;
    ry.value += (targetRy - ry.value) * ease;
    if (Math.abs(targetRx - rx.value) > 0.01 || Math.abs(targetRy - ry.value) > 0.01) {
      raf = requestAnimationFrame(loop);
    }
  }

  function onMove(e) {
    const el = elRef.value; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    targetRy = (x - 0.5) * max * 2;
    targetRx = -(y - 0.5) * max * 2;
    mx.value = x * 100;
    my.value = y * 100;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function onEnter() { hovered.value = true; }
  function onLeave() {
    hovered.value = false;
    targetRx = 0; targetRy = 0;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  onMounted(() => {
    const el = elRef.value; if (!el) return;
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
  });

  onUnmounted(() => {
    cancelAnimationFrame(raf);
    const el = elRef.value; if (!el) return;
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseenter', onEnter);
    el.removeEventListener('mouseleave', onLeave);
  });

  return { rx, ry, mx, my, hovered, scale };
}
