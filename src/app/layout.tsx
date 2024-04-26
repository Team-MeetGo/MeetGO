import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/app/provider/QueryProvider';
import { NextProvider } from './provider/NextUIProvider';
import NavBar from '@/components/common/NavBar';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MeetGo',
  description: '20대 대학생을 위한 미팅 서비스',
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 아무거나
  return (
    <html lang="ko">
      <body className={inter.className}>
        <NextProvider>
          <QueryProvider>
            <ToastContainer position="top-right" limit={1} closeButton={false} autoClose={4000} />
            <NavBar />
            {children}
            {/* <ReactQueryDevtools initialIsOpen={true} /> */}
          </QueryProvider>
        </NextProvider>
      </body>
    </html>
  );
}
