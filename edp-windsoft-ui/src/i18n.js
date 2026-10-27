import { createI18n } from 'vue-i18n';
import en from './locales/en.js';
import es from './locales/es.js';

const stored = localStorage.getItem('ws.lang');
const browser = (navigator.language || 'en').slice(0, 2);
const initial = stored || (browser === 'es' ? 'es' : 'en');

export const i18n = createI18n({
  legacy: false,
  locale: initial,
  fallbackLocale: 'en',
  messages: { en, es },
});

export function setLocale(loc) {
  i18n.global.locale.value = loc;
  localStorage.setItem('ws.lang', loc);
  document.documentElement.lang = loc;
}

document.documentElement.lang = initial;
