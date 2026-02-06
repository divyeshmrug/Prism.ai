import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prism AI - Product Analytics',
  description: 'AI-native product analytics platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            })()
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
