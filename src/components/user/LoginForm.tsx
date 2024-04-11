'use client';

import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { googleLogin, kakaoLogin } from '(@/utils/api/authAPI)';
import { ValidationModal } from '../common/ValidationModal';
import { useModalStore } from '(@/store/modalStore)';
import { authValidation } from '(@/utils/Validation)';
import { IsValidateShow, LoginData } from '(@/types/userTypes)';
import { userStore } from '(@/store/userStore)';
import { useQueryClient } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '(@/query/user/userQueryKeys)';

const LOGIN_FORM_LIST = [
  {
    type: 'email',
    name: 'userId',
    placeholder: '이메일을 입력해주세요.',
    error: '이메일 형식으로 작성해주세요.'
  },
  {
    type: 'password',
    name: 'password',
    placeholder: '비밀번호를 입력해주세요.',
    error: '숫자, 문자, 특수문자 조합으로 8자이상 작성해 주세요.'
  }
];

const LoginForm = () => {
  const queryClient = useQueryClient();

  const [loginData, setLoginData] = useState<LoginData>({ userId: '', password: '' });
  const [isValidateShow, setIsValidateShow] = useState<IsValidateShow>({
    userId: true,
    password: true
  });
  const [isError, setIsError] = useState(false);
  const { setIsLoggedIn } = userStore((state) => state);
  const { openModal } = useModalStore();

  const showModal = () => {
    openModal({
      type: 'alert',
      name: '',
      text: '로그인 되었습니다.',
      onFunc: () => {
        router.replace('/');
      }
    });
  };

  const router = useRouter();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (value === '') return setIsValidateShow((prev) => ({ ...prev, [name]: true })); // 값이 없을 때는 유효성 검사 안함
    const isValid = authValidation(name, value); // 유효성 검사 수행
    setIsValidateShow((prev) => ({ ...prev, [name]: isValid })); // 결과 반영
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const {
        data: { session },
        error
      } = await clientSupabase.auth.signInWithPassword({
        email: loginData.userId,
        password: loginData.password
      });
      if (session) {
        setIsLoggedIn(true);

        // 캐시 무효화
        // 맨 처음에 메인 페이지 -> 로그인
        queryClient.invalidateQueries({
          queryKey: [USER_DATA_QUERY_KEY]
        });

        showModal();
        console.log('로그인 성공: ', session);
      } else if (error) throw error;
    } catch (error: any) {
      if (error.message.includes('Invalid login')) {
        setIsError(true);
      } else {
        alert('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
      <div className="max-w-[450px] w-full">
        <form className="flex flex-col gap-[10px]" onSubmit={onSubmitForm}>
          {LOGIN_FORM_LIST.map(({ type, name, placeholder, error }) => (
            <label key={name}>
              <input
                className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-[#8F5DF4] w-full"
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChangeInput}
                required
              />
              {!isValidateShow[name] && <p className="text-red-500 text-[13px] mt-2">{error}</p>}
            </label>
          ))}
          <Button
            className="duration-200 bg-[#8F5DF4] text-white p-5 mt-[40px] rounded-lg font-semibold w-full py-[20px] h-auto text-[16px]"
            type="submit"
          >
            로그인
          </Button>
        </form>
        {isError && <p className="text-red-500 text-[13px] mt-2">아이디 또는 비밀번호가 일치하지 않습니다.</p>}
        <Button
          onClick={() => router.push('/users/join')}
          className="duration-200 bg-white text-[#27272A] border border-[#A1A1AA] p-5 mt-[20px] rounded-lg w-full py-[20px] h-auto text-[16px]"
          type="button"
        >
          아직 아이디가 없다면? 회원가입하기
        </Button>
        <p className="duration-200 bg-white text-[#27272A] p-5 mt-[50px] rounded-lg w-full py-[20px] h-auto text-[16px] text-center">
          소셜 계정으로 로그인하기
        </p>
        <div className="flex items-center justify-center gap-[10px]">
          <button className="border rounded-full p-4" onClick={googleLogin}>
            구글
          </button>
          <button className="border rounded-full p-4" onClick={kakaoLogin}>
            카톡
          </button>
        </div>
      </div>

      <ValidationModal />
    </>
  );
};

export default LoginForm;
