import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { updateSchool } from '@/service';
import type { UpdateSchoolType } from '@/types/userTypes';
import { QueryClient, useMutation } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const useSchoolUpdateMutation = () =>
  useMutation({
    mutationFn: ({ userId, schoolEmailInputValue, schoolNameInputValue }: UpdateSchoolType) =>
      updateSchool({ userId, schoolEmailInputValue, schoolNameInputValue }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_DATA_QUERY_KEY]
      });
    }
  });
