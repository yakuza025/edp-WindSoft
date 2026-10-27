<template>
  <div class="tab">
    <div class="tab__bar">
      <div>
        <h2 class="tab__title">Solutions</h2>
        <p class="tab__sub">{{ store.count }} published on the landing page</p>
      </div>
      <button class="adm-btn adm-btn--primary" @click="openNew">+ Add Solution</button>
    </div>

    <div v-if="store.loading" class="adm-loading">Loading…</div>
    <div v-else-if="!store.list.length" class="adm-empty">
      <p>No solutions yet.</p>
      <button class="adm-btn adm-btn--primary" @click="openNew">Add the first one</button>
    </div>

    <div v-else class="adm-list">
      <div v-for="(s, i) in store.list" :key="s.id" class="adm-item" :class="{ 'is-hidden': !s.is_active }">
        <div class="adm-item__icon" :style="{ '--c': s.color }">{{ s.icon }}</div>
        <div class="adm-item__body">
          <div class="adm-item__name">
            {{ s.title }}
            <span v-if="!s.is_active" class="adm-item__badge">Hidden</span>
            <span v-if="s.category" class="adm-item__cat">{{ s.category }}</span>
          </div>
          <div class="adm-item__tagline">{{ s.subtitle }}</div>
          <div class="adm-item__features"><span v-for="f in (s.features || []).slice(0,4)" :key="f">{{ f }}</span></div>
        </div>
        <div class="adm-item__actions">
          <div class="adm-item__order">
            <button :disabled="i === 0" @click="move(i,-1)">▲</button>
            <span>{{ i+1 }}</span>
            <button :disabled="i === store.list.length-1" @click="move(i,1)">▼</button>
          </div>
          <button class="adm-btn adm-btn--sm adm-btn--ghost" @click="toggleActive(s)">{{ s.is_active ? 'Hide' : 'Show' }}</button>
          <button class="adm-btn adm-btn--sm" @click="openEdit(s)">Edit</button>
          <button class="adm-btn adm-btn--sm adm-btn--danger" @click="remove(s)">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="modal" class="adm-modal-back" @click.self="modal = false">
      <div class="adm-modal">
        <header class="adm-modal__head">
          <h2>{{ editing ? 'Edit Solution' : 'Add Solution' }}</h2>
          <button class="adm-modal__close" @click="modal = false">×</button>
        </header>
        <div class="adm-modal__body">
          <div class="adm-form">
            <label class="adm-form__full"><span>Title *</span><input v-model="form.title" placeholder="Lending Suite" /></label>
            <label><span>Slug *</span><input v-model="form.slug" placeholder="lending-suite" :disabled="!!editing" /></label>
            <label><span>Category</span><input v-model="form.category" placeholder="Finance" /></label>
            <label class="adm-form__full"><span>Subtitle</span><input v-model="form.subtitle" placeholder="End-to-end loan origination" /></label>
            <label class="adm-form__full"><span>Description</span><textarea v-model="form.description" rows="4" placeholder="Long-form pitch for this solution…"></textarea></label>
            <label><span>Icon (emoji)</span><input v-model="form.icon" maxlength="2" placeholder="💰" /></label>
            <label><span>Color</span><input v-model="form.color" type="color" /></label>
            <label class="adm-form__full"><span>Features (comma separated)</span><input v-model="featuresText" placeholder="Origination, Underwriting, Reports" /></label>
            <label><span>CTA Label</span><input v-model="form.cta_label" placeholder="Learn more" /></label>
            <label><span>CTA Link</span><input v-model="form.cta_href" placeholder="/#contact-form" /></label>
          </div>
        </div>
        <footer class="adm-modal__foot">
          <button class="adm-btn adm-btn--ghost" @click="modal = false">Cancel</button>
          <button class="adm-btn adm-btn--primary" :disabled="saving" @click="save">{{ saving ? 'Saving…' : 'Save' }}</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSolutionsStore } from '@/stores/solutions';

const store = useSolutionsStore();
const modal = ref(false), editing = ref(null), saving = ref(false), featuresText = ref('');
const blank = () => ({ slug:'', title:'', subtitle:'', description:'', icon:'🚀', color:'#4f46e5', category:'', features:[], cta_label:'Learn more', cta_href:'', sort_order:0, is_active:1 });
const form = reactive(blank());

onMounted(async () => { try { await store.loadAdmin(); } catch (e) { alert(e.message); } });

function openNew() { editing.value = null; Object.assign(form, blank()); featuresText.value = ''; modal.value = true; }
function openEdit(s) { editing.value = s; Object.assign(form, s); featuresText.value = (s.features || []).join(', '); modal.value = true; }
async function save() {
  if (!form.title || !form.slug) return alert('Title and slug required');
  const payload = { ...form, features: featuresText.value.split(',').map((s) => s.trim()).filter(Boolean) };
  saving.value = true;
  try {
    if (editing.value) await store.update(editing.value.id, payload);
    else await store.create(payload);
    modal.value = false;
  } catch (e) { alert(e.message); } finally { saving.value = false; }
}
async function remove(s) { if (confirm(`Remove "${s.title}"?`)) { try { await store.remove(s.id); } catch (e) { alert(e.message); } } }
async function toggleActive(s) { try { await store.update(s.id, { is_active: s.is_active ? 0 : 1 }); } catch (e) { alert(e.message); } }
async function move(i, d) {
  const t = i + d;
  if (t < 0 || t >= store.list.length) return;
  const list = [...store.list];
  [list[i], list[t]] = [list[t], list[i]];
  store.list = list;
  try { await store.reorder(list.map((s) => s.id)); } catch (e) { alert(e.message); await store.loadAdmin(); }
}
</script>
