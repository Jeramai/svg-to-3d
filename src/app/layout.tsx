import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '3D SVG generator',
  description: 'Create a 3D model from any SVG image'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className='w-full h-full'>
      <body className={`w-full h-full ${inter.className}`}>{children}</body>
    </html>
  );
}
