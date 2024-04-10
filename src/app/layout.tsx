import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '(@/app/provider/QueryProvider)';
import { NextProvider } from './provider/NextUIProvider';
import NavBar from '(@/components/common/NavBar)';
import RouteChangeListener from '(@/components/chat/RouteChangeListener)';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MeetGo',
  description: '20대 대학생을 위한 미팅 서비스'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <NextProvider>
          <QueryProvider>
            <RouteChangeListener />
            <NavBar />
            {children}
          </QueryProvider>
        </NextProvider>
      </body>
    </html>
  );
}
