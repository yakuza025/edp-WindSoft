<template>
  <div class="tab">
    <div class="tab__bar">
      <div>
        <h2 class="tab__title">Demo Systems</h2>
        <p class="tab__sub">{{ systemsStore.count }} in the showcase</p>
      </div>
      <button class="adm-btn adm-btn--primary" @click="openNew">+ Add Website</button>
    </div>

    <div v-if="systemsStore.loading" class="adm-loading">Loading…</div>
    <div v-else-if="!systemsStore.list.length" class="adm-empty">
      <p>No websites in the catalog yet.</p>
      <button class="adm-btn adm-btn--primary" @click="openNew">Add the first one</button>
    </div>

    <div v-else class="adm-list">
      <div v-for="(s, i) in systemsStore.list" :key="s.id" class="adm-item" :class="{ 'is-hidden': !s.is_active }">
        <div class="adm-item__icon" :style="{ '--c': s.color }">{{ s.icon }}</div>
        <div class="adm-item__body">
          <div class="adm-item__name">{{ s.name }}<span v-if="!s.is_active" class="adm-item__badge">Hidden</span></div>
          <div class="adm-item__url"><span class="lock">🔒</span>{{ s.host }}{{ s.path }}</div>
          <div class="adm-item__tagline">{{ s.tagline }}</div>
          <div class="adm-item__features"><span v-for="f in s.features" :key="f">{{ f }}</span></div>
        </div>
        <div class="adm-item__actions">
          <div class="adm-item__order">
            <button :disabled="i === 0" @click="move(i, -1)" title="Up">▲</button>
            <span>{{ i + 1 }}</span>
            <button :disabled="i === systemsStore.list.length - 1" @click="move(i, 1)" title="Down">▼</button>
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
          <h2>{{ editing ? 'Edit Website' : 'Add Website' }}</h2>
          <button class="adm-modal__close" @click="modal = false">×</button>
        </header>
        <div class="adm-modal__body">
          <div class="adm-form">
            <label class="adm-form__full"><span>Name *</span><input v-model="form.name" /></label>
            <label><span>Slug *</span><input v-model="form.slug" :disabled="!!editing" /></label>
            <label><span>Icon</span><input v-model="form.icon" maxlength="2" /></label>
            <label class="adm-form__full"><span>Host *</span><input v-model="form.host" /></label>
            <label><span>Path</span><input v-model="form.path" /></label>
            <label><span>Color</span><input v-model="form.color" type="color" /></label>
            <label class="adm-form__full"><span>Tagline</span><textarea v-model="form.tagline" rows="2"></textarea></label>
            <label class="adm-form__full"><span>Features (comma separated)</span><input v-model="featuresText" /></label>
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
import { useRouter } from 'vue-router';
import { useSystemsStore } from '@/stores/systems';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const systemsStore = useSystemsStore();

const modal = ref(false), editing = ref(null), saving = ref(false), featuresText = ref('');
const blank = () => ({ slug:'', name:'', tagline:'', host:'', path:'/demo', color:'#4f46e5', icon:'🚀', features:[], sort_order:0, is_active:1 });
const form = reactive(blank());

async function load() {
  try { await systemsStore.loadAdmin(); }
  catch (e) {
    if (e.status === 401 || /admin key/i.test(e.message)) { auth.logout(); router.push('/login'); }
    else alert(e.message);
  }
}
function openNew() { editing.value = null; Object.assign(form, blank()); featuresText.value = ''; modal.value = true; }
function openEdit(s) { editing.value = s; Object.assign(form, s); featuresText.value = (s.features || []).join(', '); modal.value = true; }
async function save() {
  if (!form.name || !form.slug || !form.host) return alert('Name, slug, host required');
  const payload = { ...form, features: featuresText.value.split(',').map((s) => s.trim()).filter(Boolean) };
  saving.value = true;
  try {
    if (editing.value) await systemsStore.update(editing.value.id, payload);
    else await systemsStore.create(payload);
    modal.value = false;
  } catch (e) { alert(e.message); } finally { saving.value = false; }
}
async function remove(s) { if (confirm(`Remove "${s.name}"?`)) { try { await systemsStore.remove(s.id); } catch (e) { alert(e.message); } } }
async function toggleActive(s) { try { await systemsStore.update(s.id, { is_active: s.is_active ? 0 : 1 }); } catch (e) { alert(e.message); } }
async function move(i, d) {
  const t = i + d;
  if (t < 0 || t >= systemsStore.list.length) return;
  const list = [...systemsStore.list];
  [list[i], list[t]] = [list[t], list[i]];
  systemsStore.list = list;
  try { await systemsStore.reorder(list.map((s) => s.id)); }
  catch (e) { alert(e.message); await load(); }
}

onMounted(load);
</script>
