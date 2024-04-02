import { selectMessage } from '(@/services/queryFns)';
import { CHATMESSAGE_QUERY_KEY } from '(@/services/queryKeys)';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useChattingQuery = () => {
  const { data, isLoading } = useSuspenseQuery({
    queryKey: CHATMESSAGE_QUERY_KEY,
    queryFn: selectMessage
  });
  return { data, isLoading };
};
