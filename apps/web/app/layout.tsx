import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { Providers } from '@/app/providers';

import type { Metadata } from 'next';
import './global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'React Masters - Full Stack Starter Kit',
  description:
    'A modern full-stack starter kit with Next.js, Prisma, and Auth.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
