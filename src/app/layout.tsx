import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/app/provider/QueryProvider';
import { NextProvider } from './provider/NextUIProvider';
import NavBar from '@/components/common/NavBar';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { serverSupabase } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import { Suspense } from 'react';
import Footer from '@/components/common/Footer';
import { ValidationModal } from '@/components/common/ValidationModal';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'MeetGo',
  description: '20대 대학생을 위한 미팅 서비스',
  icons: { icon: '/favicon.ico' }
};
export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setUser = async () => {
    const supabase = serverSupabase();
    // 유저 데이터 가져오기
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
    // console.log('layout User =>', user);
    if (!user || error) throw error;
    const { data: userData, error: userDataErr } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', String((user as User).id))
      .single();
    if (userDataErr || !userData) {
      console.error(userDataErr.message);
    } else {
      return userData;
    }
    return user;
  };
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [USER_DATA_QUERY_KEY],
    queryFn: setUser
    // revalidateIfStale: true
  });
  return (
    <html lang="ko">
      <body className={inter.className}>
        <NextProvider>
          <QueryProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense>
                <ToastContainer position="top-right" limit={1} closeButton={false} autoClose={4000} />
                <ValidationModal />
                <NavBar />
                {children}
                <ReactQueryDevtools initialIsOpen={true} />
                <Footer />
              </Suspense>
            </HydrationBoundary>
          </QueryProvider>
        </NextProvider>
      </body>
    </html>
  );
}
