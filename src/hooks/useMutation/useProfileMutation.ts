import { updateProfile } from '(@/service)';
import { UpdateProfileType } from '(@/types/userTypes)';
import { useMutation } from '@tanstack/react-query';

export const useProfileUpdateMutation = () =>
  useMutation({
    mutationFn: ({ userId, inputNickname, inputIntro, inputKakaoId, inputGender }: UpdateProfileType) =>
      updateProfile(userId, inputNickname, inputIntro, inputKakaoId, inputGender)
  });
