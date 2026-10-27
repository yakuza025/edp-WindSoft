<template>
  <div class="tab">
    <div class="tab__bar">
      <div>
        <h2 class="tab__title">Content & Contact</h2>
        <p class="tab__sub">Edit the text shown on the landing page</p>
      </div>
      <button class="adm-btn adm-btn--primary" :disabled="saving" @click="save">
        {{ saving ? 'Saving…' : 'Save changes' }}
      </button>
    </div>

    <div v-if="loading" class="adm-loading">Loading…</div>
    <div v-else-if="saved" class="adm-toast">✓ Saved</div>

    <div class="content-grid">
      <section class="content-block">
        <h3 class="content-block__title">About / Intro</h3>
        <div class="adm-form">
          <label class="adm-form__full"><span>Section title</span><input v-model="form.about_title" /></label>
          <label class="adm-form__full"><span>Section body</span><textarea v-model="form.about_body" rows="5"></textarea></label>
        </div>

        <h4 class="content-block__sub">Highlight cards</h4>
        <div v-for="i in [1,2,3]" :key="i" class="hl-edit">
          <label><span>Icon</span><input v-model="form[`highlight_${i}_icon`]" maxlength="2" /></label>
          <label><span>Title</span><input v-model="form[`highlight_${i}_title`]" /></label>
          <label class="hl-edit__text"><span>Text</span><input v-model="form[`highlight_${i}_text`]" /></label>
        </div>
      </section>

      <section class="content-block">
        <h3 class="content-block__title">Contact</h3>
        <div class="adm-form">
          <label class="adm-form__full"><span>Headline</span><input v-model="form.contact_headline" /></label>
          <label class="adm-form__full"><span>Description</span><textarea v-model="form.contact_description" rows="3"></textarea></label>
          <label><span>Email</span><input v-model="form.contact_email" type="email" /></label>
          <label><span>Phone</span><input v-model="form.contact_phone" /></label>
          <label class="adm-form__full"><span>Address</span><input v-model="form.contact_address" /></label>
          <label><span>Hours</span><input v-model="form.contact_hours" /></label>
          <label><span>CTA label</span><input v-model="form.contact_cta_label" /></label>
        </div>

        <h4 class="content-block__sub">Social links</h4>
        <div class="adm-form">
          <label><span>LinkedIn</span><input v-model="form.social_linkedin" /></label>
          <label><span>Twitter</span><input v-model="form.social_twitter" /></label>
          <label><span>Facebook</span><input v-model="form.social_facebook" /></label>
          <label><span>GitHub</span><input v-model="form.social_github" /></label>
        </div>

        <h4 class="content-block__sub">Footer</h4>
        <div class="adm-form">
          <label class="adm-form__full"><span>Footer text</span><input v-model="form.footer_text" /></label>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useSiteContentStore } from '@/stores/siteContent';

const store = useSiteContentStore();
const form = reactive({});
const loading = ref(true);
const saving  = ref(false);
const saved   = ref(false);

onMounted(async () => {
  try {
    if (!Object.keys(store.data).length) await store.load();
    Object.assign(form, store.data);
  } catch (e) { alert(e.message); } finally { loading.value = false; }
});

async function save() {
  saving.value = true; saved.value = false;
  try {
    await store.save({ ...form });
    saved.value = true;
    setTimeout(() => { saved.value = false; }, 2500);
  } catch (e) { alert(e.message); } finally { saving.value = false; }
}
</script>
