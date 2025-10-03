import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import Script from 'next/script';
// @ts-ignore
import '@fontsource/space-grotesk';
// @ts-ignore
import '@fontsource/jetbrains-mono';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';
import { Toaster } from '@/components/ui/toaster';

const fontHeadline = Orbitron({
  subsets: ['latin'],
  variable: '--font-headline',
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
    <html lang="en" className={`${fontHeadline.variable} dark`}>
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
          {children}
          <Toaster />
        </SettingsProvider>
      </body>
    </html>
  );
}
