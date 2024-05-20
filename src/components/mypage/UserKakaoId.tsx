import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import ProfileSettingLayout from './ProfileSettingLayout';
import { useEditingStore, useProfileOnchangeStore } from '@/store/userStore';

const UserKakaoId = () => {
  const { data: user } = useGetUserDataQuery();
  const { kakaoIdInputValue, setKakaoIdInputValue } = useProfileOnchangeStore();
  const { isEditing } = useEditingStore();
  const editable = user?.nickname && true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKakaoIdInputValue(e.target.value);
  };

  return (
    <>
      <ProfileSettingLayout
        info={{
          title: '카카오톡 ID',
          required: '*',
          children: (
            <input
              disabled={!isEditing}
              className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor relative"
              name="kakaoId"
              value={kakaoIdInputValue}
              onChange={handleChange}
              minLength={2}
              maxLength={20}
            />
          )
        }}
      />
    </>
  );
};

export default UserKakaoId;
