import type { Metadata } from 'next';
import './globals.css';
import { UserRoleProvider } from '@/contexts/user-role-context';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'VajraAI Diagnostics',
  description: 'AI-Powered Transformer Diagnostics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <UserRoleProvider>
          {children}
          <Toaster />
        </UserRoleProvider>
      </body>
    </html>
  );
}
