import { getRequestConfig } from 'next-intl/server';

export const defaultLocale = 'en';

export default getRequestConfig(async () => {
  // Since we're using localePrefix: 'never', always return 'en'
  const locale = defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
