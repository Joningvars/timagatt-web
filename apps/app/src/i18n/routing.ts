import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
import {defaultLocale, locales} from '@/src/i18n/config';

export const routing = defineRouting({
  locales: locales as unknown as string[],
  defaultLocale,
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

