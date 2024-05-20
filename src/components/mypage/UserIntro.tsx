import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import ProfileSettingLayout from './ProfileSettingLayout';
import { useEditingStore, useProfileOnchangeStore } from '@/store/userStore';

const UserIntro = () => {
  const { data: user } = useGetUserDataQuery();
  const { introInputValue, setIntroInputValue } = useProfileOnchangeStore();
  const { isEditing } = useEditingStore();
  const editable = user?.nickname && true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntroInputValue(e.target.value);
  };

  return (
    <>
      <ProfileSettingLayout
        info={{
          title: '자기소개',
          required: '',
          children: (
            <input
              disabled={!isEditing || !editable}
              className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor relative"
              name="intro"
              value={introInputValue}
              onChange={handleChange}
              minLength={2}
              maxLength={15}
            />
          )
        }}
      />
    </>
  );
};

export default UserIntro;
