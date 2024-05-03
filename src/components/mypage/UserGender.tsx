import ProfileSettingLayout from './ProfileSettingLayout';
import { useEditingStore, useProfileOnchangeStore } from '@/store/userStore';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';

const UserGender = () => {
  const { data: user } = useGetUserDataQuery();
  const { genderInputValue, setGenderInputValue } = useProfileOnchangeStore();
  const { isEditing } = useEditingStore();
  const editable = !user?.gender && true;
  const genderKorea = user?.gender === 'female' ? '여성' : user?.gender === 'male' ? '남성' : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenderInputValue(e.target.value);
  };

  return (
    <>
      <ProfileSettingLayout
        info={{
          title: '성별',
          required: '*',
          children: (
            <>
              {isEditing && editable ? (
                <form className="flex gap-2">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className="mr-1"
                      onChange={handleChange}
                      required
                    />
                    여성
                  </label>
                  <label>
                    <input type="radio" name="gender" value="male" className="mr-1" onChange={handleChange} />
                    남성
                  </label>
                </form>
              ) : (
                <input
                  disabled={true}
                  className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor relative"
                  name="gender"
                  value={genderKorea}
                />
              )}
            </>
          )
        }}
      />
    </>
  );
};

export default UserGender;
