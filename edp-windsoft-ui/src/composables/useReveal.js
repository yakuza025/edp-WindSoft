import { ref, onMounted, onUnmounted } from 'vue';

export function useReveal({ threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = {}) {
  const elRef = ref(null);
  const revealed = ref(false);
  let io = null;

  onMounted(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      revealed.value = true;
      return;
    }
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            revealed.value = true;
            io?.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin },
    );
    if (elRef.value) io.observe(elRef.value);
  });

  onUnmounted(() => io?.disconnect());
  return { elRef, revealed };
}
