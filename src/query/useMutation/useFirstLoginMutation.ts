import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { updateFirstLogin } from '@/service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useFirstLoginMutation = () => {
  const queryClient = useQueryClient();
  const { mutate: mutateFirstLogin } = useMutation({
    mutationFn: (userId: string) => updateFirstLogin(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_DATA_QUERY_KEY]
      });
    }
  });
  return mutateFirstLogin;
};
