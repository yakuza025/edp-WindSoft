<template>
  <div class="adm">
    <header class="adm-head">
      <div class="adm-head__left">
        <router-link to="/" class="adm-back" title="Back to showcase">←</router-link>
        <div>
          <h1>WindSoft Console</h1>
          <p>Manage systems, solutions, content, and messages</p>
        </div>
      </div>
      <div class="adm-head__actions">
        <button class="theme-toggle" :aria-label="`Switch to ${theme.isDark ? 'light' : 'dark'} mode`" @click="theme.toggle()">
          <Transition name="icon-swap" mode="out-in">
            <svg v-if="theme.isDark" key="sun" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <svg v-else key="moon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </Transition>
        </button>
        <button class="adm-btn adm-btn--ghost" @click="logout">Sign out</button>
      </div>
    </header>

    <nav class="adm-tabs">
      <button
        v-for="t in tabs"
        :key="t.key"
        class="adm-tab"
        :class="{ 'is-active': tab === t.key }"
        @click="tab = t.key"
      >
        {{ t.label }}
        <span v-if="t.key === 'messages' && unread" class="adm-tab__badge">{{ unread }}</span>
      </button>
    </nav>

    <keep-alive>
      <component :is="activeComponent" :key="tab" @unread="unread = $event" />
    </keep-alive>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import AdminSystemsTab   from '@/components/admin/AdminSystemsTab.vue';
import AdminSolutionsTab from '@/components/admin/AdminSolutionsTab.vue';
import AdminContentTab   from '@/components/admin/AdminContentTab.vue';
import AdminMessagesTab  from '@/components/admin/AdminMessagesTab.vue';
import AdminFaqTab       from '@/components/admin/AdminFaqTab.vue';

const router = useRouter();
const auth   = useAuthStore();
const theme  = useThemeStore();

const tabs = [
  { key: 'systems',   label: 'Systems',    component: AdminSystemsTab   },
  { key: 'solutions', label: 'Solutions',  component: AdminSolutionsTab },
  { key: 'content',   label: 'Content',    component: AdminContentTab   },
  { key: 'faq',       label: 'FAQ',        component: AdminFaqTab       },
  { key: 'messages',  label: 'Messages',   component: AdminMessagesTab  },
];
const tab = ref('systems');
const unread = ref(0);

const activeComponent = computed(() => tabs.find((t) => t.key === tab.value)?.component);

function logout() {
  auth.logout();
  router.push('/login');
}

// Simple unread poller (silent)
async function pollUnread() {
  try {
    const { contactMessagesApi } = await import('@/api');
    const list = await contactMessagesApi.listAdmin();
    unread.value = (list || []).filter((m) => !m.is_read).length;
  } catch { /* ignore */ }
}

onMounted(() => {
  pollUnread();
  setInterval(pollUnread, 30000);
});
</script>
