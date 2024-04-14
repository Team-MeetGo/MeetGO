import { updateAvatar, updateProfile } from '(@/service)';
import { UpdateAvatarType, UpdateProfileType } from '(@/types/userTypes)';
import { useMutation } from '@tanstack/react-query';

export const useProfileUpdateMutation = () =>
  useMutation({
    mutationFn: ({ userId, inputNickname, inputIntro, inputKakaoId, inputGender, favorite }: UpdateProfileType) =>
      updateProfile(userId, inputNickname, inputIntro, inputKakaoId, inputGender, favorite)
  });

export const useAvatarUpdateMutation = () =>
  useMutation({
    mutationFn: ({ userId, file }: UpdateAvatarType) => updateAvatar(userId, file)
  });
