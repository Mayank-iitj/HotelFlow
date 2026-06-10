import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HotelFlow - Hotel Management Reimagined',
  description: 'Premium and intelligent hotel management platform for modern hotels.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-purple-500/30`}>
        {children}
      </body>
    </html>
  );
}
