import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Track which section id is "active" based on scroll position.
 *
 * Robust against late-rendering sections (unlike IntersectionObserver-only
 * approaches): re-checks on scroll, on resize, AND on any DOM change via
 * MutationObserver — so if #solutions renders after mount, it's picked up.
 *
 * A section becomes "active" once its top passes `offset` px from the top
 * of the viewport. At the bottom of the page, the last section wins.
 */
export function useActiveSection(sectionIds, { offset = 120 } = {}) {
  const active = ref(sectionIds[0] || null);
  let raf = 0;
  let mo = null;
  let lastId = active.value;

  function compute() {
    let best = sectionIds[0];
    let bestDist = Infinity;

    const atBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 4;

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      // Only consider sections that have passed the offset line
      if (top <= offset) {
        const dist = Math.abs(top - offset);
        if (dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      }
    }

    // Nudge: at page bottom, force the last section
    if (atBottom) {
      best = sectionIds[sectionIds.length - 1];
    }

    if (best !== lastId) {
      active.value = best;
      lastId = best;
    }
    raf = 0;
  }

  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(compute);
  }

  onMounted(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    // Re-run when new sections appear (e.g. after systems API loads)
    if ('MutationObserver' in window) {
      mo = new MutationObserver(schedule);
      mo.observe(document.body, { childList: true, subtree: true });
    }

    compute();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    cancelAnimationFrame(raf);
    mo?.disconnect();
  });

  return active;
}
