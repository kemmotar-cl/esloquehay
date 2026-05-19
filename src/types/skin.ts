/**
 * Skin System for EsLoQueHay
 *
 * This allows the entire UI to be themed/swapped by a third-party designer.
 * A "skin" is a collection of visual tokens that can be hot-swapped.
 *
 * For Fiverr designers: Provide a skin.json file following this schema.
 */

export interface Skin {
  id: string;
  name: string;
  author: string;
  version: string;

  // Color tokens
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };

  // Typography
  font: {
    family: string;
    headingWeight: number;
    bodyWeight: number;
  };

  // Spacing & Shape
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };

  // Animation preferences
  animation: {
    enabled: boolean;
    duration: string;
  };
}

// Default skin (can be replaced by designer)
export const defaultSkin: Skin = {
  id: 'default',
  name: 'EsLoQueHay Default',
  author: 'EsLoQueHay Team',
  version: '1.0.0',

  colors: {
    primary: '#ed7418',
    primaryLight: '#fdecd5',
    primaryDark: '#b8420f',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
  },

  font: {
    family: 'system-ui, -apple-system, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
  },

  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },

  animation: {
    enabled: true,
    duration: '0.2s',
  },
};

// Skin loader (in real app, this would fetch from CDN or localStorage)
export function loadSkin(skinId?: string): Skin {
  if (!skinId || skinId === 'default') return defaultSkin;

  // TODO: Load custom skin from localStorage or API
  const stored = localStorage.getItem(`skin_${skinId}`);
  if (stored) {
    try {
      return { ...defaultSkin, ...(JSON.parse(stored) as Partial<Skin>) };
    } catch {
      return defaultSkin;
    }
  }

  return defaultSkin;
}
