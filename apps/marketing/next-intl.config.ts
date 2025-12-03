import { getRequestConfig } from "next-intl/server";
import { AppLocale, defaultLocale, locales } from "./src/i18n/config";

export default getRequestConfig(async ({ locale }) => {
  const normalizedLocale = locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : defaultLocale;

  return {
    locale: normalizedLocale,
    messages: (await import(`./messages/${normalizedLocale}.json`)).default,
  };
});

