'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  // 얘를 export 하면?

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
