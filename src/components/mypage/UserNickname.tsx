import { NicknameType } from '@/types/userTypes';
import ProfileSettingLayout from './ProfileSettingLayout';
import { useEditingStore } from '@/store/userStore';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';

const UserNickname = () => {
  const { data: user } = useGetUserDataQuery();
  const { isEditing } = useEditingStore();

  return (
    <>
      <ProfileSettingLayout
        info={{
          title: '닉네임',
          required: '*',
          children: (
            <input
              //   disabled={!isEditing || !info.editable}
              className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor relative"
              name="nickname"
              value={user?.nickname || ''}
              maxLength={10}
            />
          )
        }}
      />
    </>
  );
};

export default UserNickname;
