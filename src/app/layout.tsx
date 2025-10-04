import type { Metadata } from 'next';
import {
  Orbitron,
  Rajdhani,
  Roboto_Mono,
  Inter,
  JetBrains_Mono,
} from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@/components/Analytics';
import { ThemeProvider } from '@/components/ThemeProvider';

const fontHeadline = Orbitron({
  subsets: ['latin'],
  variable: '--font-headline',
});

const fontHeadlineDark = Inter({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-headline-dark',
});

const fontBody = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const fontBodyDark = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body-dark',
});

const fontRobotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

const fontCodeDark = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-code-dark',
});

export const metadata: Metadata = {
  title: 'web-fecha-hora-clima',
  description: 'A full-screen clock and calendar display.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontHeadline.variable} ${fontHeadlineDark.variable} ${fontBody.variable} ${fontBodyDark.variable} ${fontRobotoMono.variable} ${fontCodeDark.variable}`}
    >
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-FF81FMV5GT"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FF81FMV5GT');
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        <SettingsProvider>
          <ThemeProvider>
            <Analytics />
            {children}
            <Toaster />
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
