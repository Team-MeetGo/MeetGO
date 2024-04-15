import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { updateAvatar, updateProfile } from '@/service';
import { UpdateAvatarType, UpdateProfileType } from '@/types/userTypes';
import { QueryClient, useMutation } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const useProfileUpdateMutation = () =>
  useMutation({
    mutationFn: ({ userId, inputNickname, inputIntro, inputKakaoId, inputGender, favorite }: UpdateProfileType) =>
      updateProfile(userId, inputNickname, inputIntro, inputKakaoId, inputGender, favorite)
  });

export const useAvatarUpdateMutation = () =>
  useMutation({
    mutationFn: ({ userId, file }: UpdateAvatarType) => updateAvatar(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USER_DATA_QUERY_KEY]
      });
      console.log('성공한건지 확인용');
    }
  });
