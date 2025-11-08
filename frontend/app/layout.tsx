import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// TODO: Import providers
// import { AuthProvider } from '@/context/AuthContext';
// import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaaS Ticketing - Gestion de Projets',
  description: 'Plateforme de gestion de projets et tickets avec time tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* TODO: Add providers */}
        {/* <AuthProvider> */}
        {children}
        {/* <Toaster /> */}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}

