<template>
  <div class="tab">
    <div class="tab__bar">
      <div>
        <h2 class="tab__title">FAQ</h2>
        <p class="tab__sub">{{ store.count }} question{{ store.count === 1 ? '' : 's' }}</p>
      </div>
      <button class="adm-btn adm-btn--primary" @click="openNew">+ Add Question</button>
    </div>

    <div v-if="store.loading" class="adm-loading">Loading…</div>
    <div v-else-if="!store.list.length" class="adm-empty">
      <p>No FAQ items yet.</p>
      <button class="adm-btn adm-btn--primary" @click="openNew">Add the first one</button>
    </div>

    <div v-else class="adm-list">
      <div v-for="(f, i) in store.list" :key="f.id" class="adm-item" :class="{ 'is-hidden': !f.is_active }">
        <div class="adm-item__icon" style="background:var(--accent-soft);color:var(--accent)">?</div>
        <div class="adm-item__body">
          <div class="adm-item__name">
            {{ f.question }}
            <span v-if="!f.is_active" class="adm-item__badge">Hidden</span>
          </div>
          <div class="adm-item__tagline">{{ f.answer.slice(0, 140) }}{{ f.answer.length > 140 ? '…' : '' }}</div>
        </div>
        <div class="adm-item__actions">
          <div class="adm-item__order">
            <button :disabled="i === 0" @click="move(i, -1)">▲</button>
            <span>{{ i + 1 }}</span>
            <button :disabled="i === store.list.length - 1" @click="move(i, 1)">▼</button>
          </div>
          <button class="adm-btn adm-btn--sm adm-btn--ghost" @click="toggleActive(f)">
            {{ f.is_active ? 'Hide' : 'Show' }}
          </button>
          <button class="adm-btn adm-btn--sm" @click="openEdit(f)">Edit</button>
          <button class="adm-btn adm-btn--sm adm-btn--danger" @click="remove(f)">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="modal" class="adm-modal-back" @click.self="modal = false">
      <div class="adm-modal">
        <header class="adm-modal__head">
          <h2>{{ editing ? 'Edit Question' : 'Add Question' }}</h2>
          <button class="adm-modal__close" @click="modal = false">×</button>
        </header>
        <div class="adm-modal__body">
          <div class="adm-form">
            <label class="adm-form__full">
              <span>Question *</span>
              <input v-model="form.question" placeholder="How long does implementation take?" />
            </label>
            <label class="adm-form__full">
              <span>Answer *</span>
              <textarea v-model="form.answer" rows="5" placeholder="Detailed answer…"></textarea>
            </label>
          </div>
        </div>
        <footer class="adm-modal__foot">
          <button class="adm-btn adm-btn--ghost" @click="modal = false">Cancel</button>
          <button class="adm-btn adm-btn--primary" :disabled="saving" @click="save">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useFaqStore } from '@/stores/faq';

const store = useFaqStore();
const modal = ref(false), editing = ref(null), saving = ref(false);
const blank = () => ({ question: '', answer: '', sort_order: 0, is_active: 1 });
const form = reactive(blank());

onMounted(async () => { try { await store.loadAdmin(); } catch (e) { alert(e.message); } });

function openNew() { editing.value = null; Object.assign(form, blank()); modal.value = true; }
function openEdit(f) { editing.value = f; Object.assign(form, f); modal.value = true; }
async function save() {
  if (!form.question || !form.answer) return alert('Question and answer required');
  saving.value = true;
  try {
    if (editing.value) await store.update(editing.value.id, form);
    else await store.create(form);
    modal.value = false;
  } catch (e) { alert(e.message); } finally { saving.value = false; }
}
async function remove(f) { if (confirm('Delete this question?')) { try { await store.remove(f.id); } catch (e) { alert(e.message); } } }
async function toggleActive(f) { try { await store.update(f.id, { is_active: f.is_active ? 0 : 1 }); } catch (e) { alert(e.message); } }
async function move(i, d) {
  const t = i + d;
  if (t < 0 || t >= store.list.length) return;
  const list = [...store.list];
  [list[i], list[t]] = [list[t], list[i]];
  store.list = list;
  try { await store.reorder(list.map((x) => x.id)); } catch (e) { alert(e.message); await store.loadAdmin(); }
}
</script>
