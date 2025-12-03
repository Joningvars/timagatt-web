export const locales = ['is', 'en'] as const;
export const defaultLocale = 'is';
export type AppLocale = (typeof locales)[number];

