<template>
  <section ref="elRef" class="manifesto" :class="{ 'is-in': revealed }">
    <div class="manifesto__rule"></div>

    <div class="manifesto__inner">
      <span class="manifesto__mark">❝</span>

      <h2 class="manifesto__title">
        {{ content.about_title || 'Software built for the way you work' }}
      </h2>

      <p class="manifesto__body">{{ content.about_body }}</p>

      <ol class="manifesto__highlights">
        <li
          v-for="i in 3"
          :key="i"
          v-show="content[`highlight_${i}_title`]"
          class="manifesto__item"
          :style="{ '--d': `${i * 90}ms` }"
        >
          <span class="manifesto__num">0{{ i }}</span>
          <span class="manifesto__icon">{{ content[`highlight_${i}_icon`] }}</span>
          <div class="manifesto__text">
            <h3>{{ content[`highlight_${i}_title`] }}</h3>
            <p>{{ content[`highlight_${i}_text`] }}</p>
          </div>
        </li>
      </ol>
    </div>

    <div class="manifesto__rule"></div>
  </section>
</template>

<script setup>
import { useReveal } from '@/composables/useReveal';

defineProps({
  content: { type: Object, default: () => ({}) },
});

const { elRef, revealed } = useReveal();
</script>
