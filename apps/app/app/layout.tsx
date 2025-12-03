import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { defaultLocale } from '@/src/i18n/config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Timagatt',
  description: 'Time management for individuals and companies',
};

const dashboardPath = `/${defaultLocale}/dashboard`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignInUrl={dashboardPath} afterSignUpUrl={dashboardPath}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
