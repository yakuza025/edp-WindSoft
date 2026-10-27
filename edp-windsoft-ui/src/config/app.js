export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3021/api/v1';

export const APP_VERSION =
  import.meta.env.VITE_APP_VERSION || '1.0.0';

export const DEFAULTS = {
  AUTOPLAY_MS:       6000,
  HINT_TIMEOUT_MS:   12000,
  SWIPE_THRESHOLD_PX: 60,
};

export const STORAGE_KEYS = {
  ADMIN_KEY: 'ws.admin',
  THEME: 'ws.theme',
};
