<template>
  <div class="tab">
    <div class="tab__bar">
      <div>
        <h2 class="tab__title">Contact Messages</h2>
        <p class="tab__sub">
          {{ list.length }} total · {{ unreadCount }} unread
          <span v-if="search">· {{ filtered.length }} matching</span>
        </p>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center">
        <input
          v-model="search"
          type="search"
          class="msg-search"
          placeholder="Search name, email, subject, message…"
        />
        <button class="adm-btn adm-btn--ghost" :disabled="loading" @click="reload">
          {{ loading ? 'Loading…' : 'Refresh' }}
        </button>
      </div>
    </div>

    <div v-if="loading && !list.length" class="adm-loading">Loading…</div>
    <div v-else-if="!list.length" class="adm-empty"><p>No messages yet.</p></div>
    <div v-else-if="!filtered.length" class="adm-empty">
      <p>No messages matching "<strong>{{ search }}</strong>".</p>
    </div>

    <div v-else class="msg-list">
      <article
        v-for="m in paged"
        :key="m.id"
        class="msg"
        :class="{ 'msg--unread': !m.is_read }"
      >
        <header class="msg__head" @click="toggle(m.id)">
          <div class="msg__meta">
            <strong>{{ m.name }}</strong>
            <span class="msg__email">{{ m.email }}</span>
            <span v-if="!m.is_read" class="msg__dot"></span>
          </div>
          <div class="msg__sub">
            <span v-if="m.subject" class="msg__subject">{{ m.subject }}</span>
            <time>{{ formatDate(m.created_at) }}</time>
          </div>
          <span class="msg__chev">{{ expanded[m.id] ? '▾' : '▸' }}</span>
        </header>

        <div v-if="expanded[m.id]" class="msg__body">
          <div v-if="m.phone" class="msg__field"><b>Phone:</b> {{ m.phone }}</div>
          <p class="msg__text">{{ m.message }}</p>
          <div class="msg__actions">
            <button class="adm-btn adm-btn--sm adm-btn--ghost" @click="toggleRead(m)">
              {{ m.is_read ? 'Mark unread' : 'Mark read' }}
            </button>
            <a :href="`mailto:${m.email}`" class="adm-btn adm-btn--sm">Reply by email</a>
            <button class="adm-btn adm-btn--sm adm-btn--danger" @click="remove(m)">Delete</button>
          </div>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="msg-pager">
      <button class="adm-btn adm-btn--sm adm-btn--ghost" :disabled="page === 1" @click="page = 1">« First</button>
      <button class="adm-btn adm-btn--sm adm-btn--ghost" :disabled="page === 1" @click="page--">‹ Prev</button>
      <span class="msg-pager__info">Page {{ page }} / {{ totalPages }} · {{ filtered.length }} total</span>
      <button class="adm-btn adm-btn--sm adm-btn--ghost" :disabled="page === totalPages" @click="page++">Next ›</button>
      <button class="adm-btn adm-btn--sm adm-btn--ghost" :disabled="page === totalPages" @click="page = totalPages">Last »</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import * as svc from '@/services/contactMessages.service';

const emit = defineEmits(['unread']);

const list = ref([]);
const loading = ref(false);
const expanded = reactive({});
const search = ref('');
const page = ref(1);
const PAGE_SIZE = 20;

const unreadCount = computed(() => list.value.filter((m) => !m.is_read).length);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return list.value;
  return list.value.filter((m) =>
    [m.name, m.email, m.subject, m.message, m.phone]
      .filter(Boolean)
      .some((s) => String(s).toLowerCase().includes(q))
  );
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)));

const paged = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return filtered.value.slice(start, start + PAGE_SIZE);
});

// Reset page when search changes
watch(search, () => { page.value = 1; });
watch(filtered, () => { if (page.value > totalPages.value) page.value = totalPages.value; });

async function reload() {
  loading.value = true;
  try { list.value = await svc.listAdmin(); }
  catch (e) { alert(e.message); }
  finally {
    loading.value = false;
    emit('unread', unreadCount.value);
  }
}

function toggle(id) { expanded[id] = !expanded[id]; }
async function toggleRead(m) {
  try { await svc.markRead(m.id, m.is_read ? 0 : 1); await reload(); }
  catch (e) { alert(e.message); }
}
async function remove(m) {
  if (!confirm(`Delete message from "${m.name}"?`)) return;
  try { await svc.remove(m.id); await reload(); }
  catch (e) { alert(e.message); }
}
function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleString(); } catch { return d; }
}

onMounted(reload);
</script>

<style scoped>
.msg-search {
  padding: .45rem .75rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  color: var(--text);
  font-size: .82rem;
  outline: none;
  min-width: 240px;
  transition: border-color .15s, box-shadow .15s;
}
.msg-search:focus {
  border-color: var(--accent);
  box-shadow: var(--ring);
}
.msg-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .4rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}
.msg-pager__info {
  padding: 0 .75rem;
  font-family: var(--mono);
  font-size: .72rem;
  color: var(--text-3);
}
@media (max-width: 640px) {
  .msg-search { min-width: 0; width: 100%; }
  .tab__bar > div:last-child { flex-direction: column; align-items: stretch; width: 100%; }
}
</style>
