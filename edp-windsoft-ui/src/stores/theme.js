import { defineStore } from 'pinia';
import { STORAGE_KEYS } from '@/config/app';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: 'dark',
    systemPrefers: 'dark',
    _initialized: false,
  }),

  getters: {
    isDark: (s) => s.mode === 'dark',
    isLight: (s) => s.mode === 'light',
  },

  actions: {
    init() {
      if (this._initialized) return;

      // Read saved preference
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);

      // Detect system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemPrefers = mq.matches ? 'dark' : 'light';

        const handler = (e) => {
          this.systemPrefers = e.matches ? 'dark' : 'light';
        };
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else if (mq.addListener) mq.addListener(handler);
      }

      // Resolve initial mode
      if (saved === 'light' || saved === 'dark') {
        this.mode = saved;
      } else {
        this.mode = this.systemPrefers;
      }

      this.apply();
      this._initialized = true;
    },

    apply() {
      const root = document.documentElement;
      root.setAttribute('data-theme', this.mode);
      root.style.colorScheme = this.mode;
    },

    setMode(mode) {
      if (mode !== 'light' && mode !== 'dark') return;
      this.mode = mode;
      localStorage.setItem(STORAGE_KEYS.THEME, mode);
      this.apply();
    },

    toggle() {
      const next = this.isDark ? 'light' : 'dark';
      const root = document.documentElement;
      root.classList.add('theme-transition');
      this.setMode(next);
      setTimeout(() => root.classList.remove('theme-transition'), 400);
    },
  },
});
