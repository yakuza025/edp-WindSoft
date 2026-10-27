import { defineStore } from 'pinia';

export const useAmbientStore = defineStore('ambient', {
  state: () => ({
    primary: null,     // hex color from active system
    secondary: null,   // derived complementary
    intensity: 1,      // 0..1 multiplier
  }),

  actions: {
    set({ primary, secondary, intensity } = {}) {
      if (primary !== undefined) this.primary = primary;
      if (secondary !== undefined) this.secondary = secondary;
      if (intensity !== undefined) this.intensity = intensity;
    },
    reset() {
      this.primary = null;
      this.secondary = null;
      this.intensity = 1;
    },
  },
});

/* Helper: derive a harmonious secondary from a hex color */
export function deriveSecondary(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return null;
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  const h2 = ((h * 360 + 40) % 360) / 360;
  s = Math.min(1, s * 1.05);
  l = Math.max(0.42, Math.min(0.72, l));

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let R, G, B;
  if (s === 0) { R = G = B = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    R = hue2rgb(p, q, h2 + 1/3);
    G = hue2rgb(p, q, h2);
    B = hue2rgb(p, q, h2 - 1/3);
  }
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
}
