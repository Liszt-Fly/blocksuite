export type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

/**
 * Tiny translation bridge for BlockSuite code.
 * - Uses a global translator registered by the host app, e.g. Vue i18n.
 * - Falls back to provided fallback or the key itself.
 */
export function t(key: string, fallback?: string, params?: Record<string, unknown>): string {
  try {
    const g = globalThis as unknown as { __APP_I18N_T__?: TranslateFn };
    const fn = g.__APP_I18N_T__;
    if (typeof fn === 'function') {
      const res = fn(key, params);
      if (typeof res === 'string' && res.length > 0) return res;
    }
  } catch {}
  return fallback ?? key;
}

