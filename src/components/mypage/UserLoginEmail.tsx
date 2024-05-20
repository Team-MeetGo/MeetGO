import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import ProfileSettingLayout from './ProfileSettingLayout';

const UserLoginEmail = () => {
  const { data: user } = useGetUserDataQuery();

  return (
    <>
      <ProfileSettingLayout
        info={{
          title: '계정 이메일',
          required: '*',
          children: (
            <input
              disabled={true}
              className="flex flex-col items-start text-sm text-[#9CA3AF] max-w-[342px] w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-mainColor relative"
              name="login_email"
              value={user?.login_email as string}
            />
          )
        }}
      />
    </>
  );
};

export default UserLoginEmail;
