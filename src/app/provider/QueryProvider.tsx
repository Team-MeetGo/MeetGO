// 'use client';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const QueryProvider = ({ children }: { children: React.ReactNode }) => {
//   const queryClient = new QueryClient();

//   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
// };

// export default QueryProvider;

'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000
      }
    }
  });
}
let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
export default function QueryProvider({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
