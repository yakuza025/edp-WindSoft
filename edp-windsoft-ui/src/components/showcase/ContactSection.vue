<template>
  <section id="contact" ref="elRef" class="postcard" :class="{ 'is-in': revealed }">
    <div class="postcard__frame">
      <header class="postcard__head">
        <span class="postcard__from">A note from WindSoft</span>
        <span class="postcard__date">{{ today }}</span>
      </header>

      <div class="postcard__grid">
        <aside class="postcard__info">
          <h2 class="postcard__headline">
            {{ content.contact_headline || 'Let us build something great together' }}
          </h2>
          <p class="postcard__desc">{{ content.contact_description }}</p>

          <dl class="postcard__list">
            <div v-if="content.contact_email" class="postcard__row">
              <dt>Email</dt>
              <dd><a :href="`mailto:${content.contact_email}`">{{ content.contact_email }}</a></dd>
            </div>
            <div v-if="content.contact_phone" class="postcard__row">
              <dt>Phone</dt>
              <dd><a :href="`tel:${content.contact_phone}`">{{ content.contact_phone }}</a></dd>
            </div>
            <div v-if="content.contact_address" class="postcard__row">
              <dt>Address</dt>
              <dd>{{ content.contact_address }}</dd>
            </div>
            <div v-if="content.contact_hours" class="postcard__row">
              <dt>Hours</dt>
              <dd>{{ content.contact_hours }}</dd>
            </div>
          </dl>

          <div v-if="socials.length" class="postcard__socials">
            <a v-for="s in socials" :key="s.name" :href="s.url" target="_blank" rel="noopener">
              {{ s.label }}
            </a>
          </div>

          <div class="postcard__stamp" aria-hidden="true">
            <span>WIND</span>
            <span>SOFT</span>
            <span class="postcard__stamp-year">EST · 2025</span>
          </div>
        </aside>

        <form class="postcard__form" @submit.prevent="submit">
          <p class="postcard__lede">Drop us a line — we read every one.</p>

          <div class="postcard__field">
            <label>From</label>
            <input v-model="form.name" required maxlength="120" placeholder="Your name" />
          </div>

          <div class="postcard__field">
            <label>Reply to</label>
            <input v-model="form.email" type="email" required maxlength="200" placeholder="you@company.com" />
          </div>

          <div class="postcard__field">
            <label>Phone <span>(optional)</span></label>
            <input v-model="form.phone" type="tel" maxlength="40" />
          </div>

          <div class="postcard__field">
            <label>Subject <span>(optional)</span></label>
            <input v-model="form.subject" maxlength="200" />
          </div>

          <div class="postcard__field postcard__field--lines">
            <label>Message</label>
            <textarea v-model="form.message" rows="6" required maxlength="5000" placeholder="Tell us what you're working on…"></textarea>
          </div>

          <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true" />

          <div v-if="error" class="postcard__msg postcard__msg--err">{{ error }}</div>
          <div v-if="success" class="postcard__msg postcard__msg--ok">{{ success }}</div>

          <button type="submit" class="postcard__submit" :disabled="sending">
            <span>{{ sending ? 'Sending…' : (content.contact_cta_label || 'Send message') }}</span>
            <span class="postcard__arrow">→</span>
          </button>
        </form>
      </div>
    </div>

    <footer v-if="content.footer_text" class="postcard__foot">
      <span>{{ content.footer_text }}</span>
      <span>— WindSoft</span>
    </footer>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import * as svc from '@/services/contactMessages.service';
import { useReveal } from '@/composables/useReveal';

const props = defineProps({
  content: { type: Object, default: () => ({}) },
});

const { elRef, revealed } = useReveal();

const form = reactive({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
const sending = ref(false);
const error = ref('');
const success = ref('');

const today = computed(() =>
  new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
);

const socials = computed(() => {
  const c = props.content;
  const out = [];
  if (c.social_linkedin) out.push({ name: 'LinkedIn', label: 'in', url: c.social_linkedin });
  if (c.social_twitter)  out.push({ name: 'Twitter',  label: '𝕏',  url: c.social_twitter });
  if (c.social_facebook) out.push({ name: 'Facebook', label: 'f',  url: c.social_facebook });
  if (c.social_github)   out.push({ name: 'GitHub',   label: 'GH', url: c.social_github });
  return out;
});

async function submit() {
  error.value = ''; success.value = '';
  sending.value = true;
  try {
    await svc.submit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      subject: form.subject.trim() || undefined,
      message: form.message.trim(),
      website: form.website,
    });
    success.value = 'Sent — thanks for writing. We will reply shortly.';
    form.name = form.email = form.phone = form.subject = form.message = '';
  } catch (e) {
    error.value = e.message || 'Could not send. Please try again.';
  } finally {
    sending.value = false;
  }
}
</script>
