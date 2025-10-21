import { createIdentifier } from '@blocksuite/global/di';
import type { ExtensionType } from '@blocksuite/store';
import { computed, signal, type Signal } from '@preact/signals-core';

import { KVContextProvider, type KVContextType } from './kv-context';

export type Locale = string; // e.g. 'en', 'en-US', 'zh-CN'

export type MessageDict = Record<string, string | MessageDict>;

export interface I18nService {
  locale$: Signal<Locale>;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, unknown>) => string;
  tf: (key: string, params?: Record<string, unknown>) => Signal<string>; // reactive translation
  formatNumber: (n: number, opts?: Intl.NumberFormatOptions) => string;
  formatDate: (d: Date | number, opts?: Intl.DateTimeFormatOptions) => string;
}

export const I18nProvider = createIdentifier<I18nService>('AffineI18nProvider');

export type I18nOptions = {
  defaultLocale: Locale;
  messages?: Record<Locale, MessageDict>;
  loadLocale?: (locale: Locale) => Promise<MessageDict>; // optional async loader
  persistKey?: string; // kv key, default 'locale'
};

function flatten(prefix: string, obj: MessageDict, out: Record<string, string>) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else flatten(key, v, out);
  }
}

function formatTemplate(tpl: string, params?: Record<string, unknown>) {
  if (!params) return tpl;
  return tpl.replace(/\{(\w+)\}/g, (_, k) =>
    k in params ? String(params[k]) : `{${k}}`
  );
}

export function I18nExtension(options: I18nOptions): ExtensionType {
  const { defaultLocale, messages = {}, loadLocale, persistKey = 'locale' } = options;

  // store flattened maps per-locale for fast lookups
  const cache = new Map<Locale, Record<string, string>>();

  // pre-load provided messages
  for (const [loc, dict] of Object.entries(messages)) {
    const flat: Record<string, string> = {};
    flatten('', dict, flat);
    cache.set(loc, flat);
  }

  // runtime state
  const locale$ = signal<Locale>(defaultLocale);

  async function ensureLoaded(loc: Locale) {
    if (cache.has(loc)) return;
    if (!loadLocale) return;
    const dict = await loadLocale(loc);
    const flat: Record<string, string> = {};
    flatten('', dict, flat);
    cache.set(loc, flat);
  }

  const implFactory = (kv?: KVContextType): I18nService => {
    // initial locale from KV if present
    const persisted = kv?.get<string>(persistKey);
    if (persisted) locale$.value = persisted;

    const getMessage = (key: string): string | undefined => {
      const current = cache.get(locale$.peek());
      const fallback = cache.get(defaultLocale);
      return current?.[key] ?? fallback?.[key];
    };

    const t = (key: string, params?: Record<string, unknown>): string => {
      const msg = getMessage(key);
      return msg ? formatTemplate(msg, params) : key; // fallback to key
    };

    const tf = (key: string, params?: Record<string, unknown>) =>
      computed(() => t(key, params));

    const setLocale = async (loc: Locale) => {
      if (loc === locale$.peek()) return;
      await ensureLoaded(loc).catch(console.error);
      locale$.value = loc;
      kv?.set(persistKey, loc);
    };

    const formatNumber = (n: number, opts?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale$.peek(), opts).format(n);

    const formatDate = (
      d: Date | number,
      opts?: Intl.DateTimeFormatOptions
    ) => new Intl.DateTimeFormat(locale$.peek(), opts).format(d);

    return { locale$, setLocale, t, tf, formatNumber, formatDate };
  };

  return {
    setup: di => {
      // we depend on KV if available, but don't require it
      const kv = di.provider().getOptional?.(KVContextProvider) as
        | KVContextType
        | undefined;
      di.addImpl(I18nProvider, () => implFactory(kv));
    },
  };
}

