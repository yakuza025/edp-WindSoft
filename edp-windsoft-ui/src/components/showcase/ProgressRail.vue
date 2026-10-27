<template>
  <div ref="railRef" class="progress-rail">
    <div
      v-for="(i, idx) in count"
      :key="idx"
      class="progress-seg"
      :class="{
        'done':   idx < current,
        'active': idx === current && !paused,
      }"
      :title="`Jump to system ${idx + 1}`"
      @click="$emit('select', idx)"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  count:      { type: Number,  default: 0 },
  current:    { type: Number,  default: 0 },
  paused:     { type: Boolean, default: false },
  autoplayMs: { type: Number,  default: 6000 },
});

defineEmits(['select']);

const railRef = ref(null);

function restart() {
  const segs = railRef.value ? Array.from(railRef.value.children) : [];
  segs.forEach((seg, i) => {
    seg.classList.remove('active', 'done');
    if (i < props.current) seg.classList.add('done');
    if (i === props.current && !props.paused) {
      void seg.offsetWidth;
      seg.classList.add('active');
    }
  });
}

watch(
  [() => props.current, () => props.paused, () => props.count],
  () => nextTick(restart),
);

onMounted(() => nextTick(restart));
</script>
