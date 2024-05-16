import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { updateSchool } from '@/service';
import type { UpdateSchoolType } from '@/types/userTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSchoolUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, schoolEmailInputValue, schoolNameInputValue }: UpdateSchoolType) =>
      updateSchool({ userId, schoolEmailInputValue, schoolNameInputValue }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_DATA_QUERY_KEY]
      });
    }
  });
};
