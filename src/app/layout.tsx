import type { Metadata } from 'next';
import { Orbitron, Rajdhani, Roboto_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SettingsProvider } from '@/context/SettingsContext';
import { Toaster } from '@/components/ui/toaster';

const fontHeadline = Orbitron({
  subsets: ['latin'],
  variable: '--font-headline',
});

const fontBody = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const fontRobotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
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
      className={`${fontHeadline.variable} ${fontBody.variable} ${fontRobotoMono.variable} dark`}
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
          {children}
          <Toaster />
        </SettingsProvider>
      </body>
    </html>
  );
}
