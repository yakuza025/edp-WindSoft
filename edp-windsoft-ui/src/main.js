import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useThemeStore } from '@/stores/theme';
import './styles/showcase.css';
import { i18n } from '@/i18n';

const app = createApp(App);
app.use(createPinia());
app.use(i18n);

// Apply theme before mount to avoid flash
useThemeStore().init();

app.use(router);
app.mount('#app');
