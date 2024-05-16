import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { updateAvatar, updateProfile } from '@/service';
import { UpdateAvatarType, UpdateProfileType } from '@/types/userTypes';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';

export const useProfileUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateProfileType>({
    mutationFn: async ({ userId, inputNickname, inputIntro, inputKakaoId, inputGender, favorite }) => {
      await updateProfile(userId, inputNickname, inputIntro, inputKakaoId, inputGender, favorite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_DATA_QUERY_KEY]
      });
    }
  });
};

export const useAvatarUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, file }: UpdateAvatarType) => updateAvatar(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_DATA_QUERY_KEY]
      });
    }
  });
};
