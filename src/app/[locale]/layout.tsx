import './globals.css';
import '@radix-ui/themes/styles.css';
import React from 'react';
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout';
import { Metadata } from 'next'
import { GoogleAnalyticsScript } from "@/components/analytics/GoogleAnalyticsScript";
import { PlausibleAnalyticsScript } from "@/components/analytics/PlausibleAnalyticsScript";
import GoogleAdsenseScript from "@/components/ads/GoogleAdsenseScript";
import { ThemeProvider } from "next-themes"
import { DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] })
const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: '机场推荐：全网最全机场节点导航',
    template: '%s | 机场推荐'
  },
  description: '提供最全面的机场节点推荐，帮助您找到最适合的服务',
  authors: { name: '机场推荐', url: 'https://jichangtuijian.shop/' },
  keywords: '',
  alternates: {
    canonical: "https://jichangtuijian.shop/", 
    languages: {
      "en-US": "https://jichangtuijian.shop/en/",
      "zh-CN": "https://jichangtuijian.shop/zh/",
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon-180x180.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png', rel: 'android-chrome' }
    ]
  }
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <>
      <html lang={locale} suppressHydrationWarning>
        <head />
        <body className={cn(inter.className, sansFont.variable,
        )}>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"

            >
              <Layout>{children}</Layout>
              <GoogleAdsenseScript />
              <GoogleAnalyticsScript />
              <PlausibleAnalyticsScript />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </>
  )
}