import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';
// import { Chatbot } from '@/components/ai-chatbot';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        {/* Uncomment the line below to enable the AI chatbot component */}
        {/* <Chatbot /> */}
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'FunnyNote UI',
  description: 'Phiên bản giao diện người dùng của FunnyNote',
  icons: {
    icon: '/funnynote-logo.png',
    apple: '/funnynote-logo.png',
  },
  openGraph: {
    title: 'FunnyNote UI',
    description: 'Phiên bản giao diện người dùng của FunnyNote',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'FunnyNote UI',
    images: [
      {
        url: '/funnynote-logo.png',
        width: 1200,
        height: 630,
        alt: 'FunnyNote Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};
