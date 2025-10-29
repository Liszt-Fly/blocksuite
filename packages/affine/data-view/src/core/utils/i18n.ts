import { I18nProvider } from '@blocksuite/affine-shared/services';

// Lightweight helper to fetch translated text with graceful fallback.
// It tries view.serviceGet(I18nProvider)?.t(key). If no i18n or missing key,
// it returns the provided fallback string.
export const tt = (view: { serviceGet: (k: unknown) => any }, key: string, fb: string) => {
  const i18n = view?.serviceGet?.(I18nProvider);
  const t: (k: string) => string = i18n?.t ?? (k => k);
  const v = t(key);
  return v === key ? fb : v;
};

// Returns a translator function bound to the given view with fallback support.
export const getT = (view: { serviceGet: (k: unknown) => any }) => {
  const i18n = view?.serviceGet?.(I18nProvider);
  const t: (k: string) => string = i18n?.t ?? (k => k);
  return (key: string, fb: string) => {
    const v = t(key);
    return v === key ? fb : v;
  };
};

