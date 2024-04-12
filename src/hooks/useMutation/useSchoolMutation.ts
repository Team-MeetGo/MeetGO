import { updateSchool } from '(@/service)';
import { UpdateSchoolType } from '(@/types/userTypes)';
import { useMutation } from '@tanstack/react-query';

export const useSchoolUpdateMutation = () =>
  useMutation({
    mutationFn: ({ userId, schoolEmail, univName }: UpdateSchoolType) => updateSchool({ userId, schoolEmail, univName })
  });
