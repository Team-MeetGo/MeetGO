import { updateProfile, updateSchool } from '(@/service)';
import { UpdateProfileType, UpdateSchoolType } from '(@/types/userTypes)';
import { useMutation } from '@tanstack/react-query';

export const useSchoolUpdateMutation = () =>
  useMutation({
    mutationFn: ({ userId, schoolEmail, univName }: UpdateSchoolType) => updateSchool({ userId, schoolEmail, univName })
  });
