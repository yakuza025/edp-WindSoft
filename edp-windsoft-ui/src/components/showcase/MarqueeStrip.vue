<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee__track">
      <span v-for="n in 2" :key="n" class="marquee__pass">
        <template v-for="(w, i) in words" :key="`${n}-${i}`">
          <span class="marquee__word">{{ w }}</span>
          <span class="marquee__mark">✦</span>
        </template>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  words: { type: Array, default: () => [] },
});
</script>
