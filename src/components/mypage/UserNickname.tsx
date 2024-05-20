import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import ProfileSettingLayout from './ProfileSettingLayout';
import { useEditingStore, useProfileOnchangeStore } from '@/store/userStore';

const UserNickname = () => {
  const { data: user } = useGetUserDataQuery();
  const { nicknameInputValue, setNicknameInputValue } = useProfileOnchangeStore();
  const { isEditing } = useEditingStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNicknameInputValue(e.target.value);
  };

  return (
    <>
      <ProfileSettingLayout
        info={{
          title: '닉네임',
          required: '*',
          children: (
            <input
              disabled={!isEditing}
              className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor relative"
              name="nickname"
              value={nicknameInputValue}
              onChange={handleChange}
              minLength={2}
              maxLength={10}
            />
          )
        }}
      />
    </>
  );
};

export default UserNickname;
