'use client';

import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';

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
  const [loginData, setLoginData] = useState({ userId: '', password: '' });
  const [isValidate, setIsValidate] = useState({
    userId: false,
    password: false
  });

  const router = useRouter();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
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
        console.log('로그인 성공');
        router.push('/');
      } else if (error) throw error;
    } catch (error) {
      console.error('에러: ', error);
    }
  };

  return (
    <form className="max-w-[450px] flex flex-col gap-[10px] w-full" onSubmit={onSubmitForm}>
      {LOGIN_FORM_LIST.map(({ type, name, placeholder, error }) => (
        <label key={name}>
          <input
            className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-[#8F5DF4] w-full"
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={onChangeInput}
          />
        </label>
      ))}

      <Button
        className="duration-200 bg-[#8F5DF4] text-white p-5 mt-[40px] rounded-lg font-semibold w-full py-[20px] h-auto text-[16px]"
        type="submit"
      >
        로그인
      </Button>
      <Button
        onClick={() => router.push('/users/join')}
        className="duration-200 bg-white text-[#27272A] border border-[#A1A1AA] p-5 mt-[10px] rounded-lg w-full py-[20px] h-auto text-[16px]"
        type="button"
      >
        아직 아이디가 없다면? 회원가입하기
      </Button>
      <p className="duration-200 bg-white text-[#27272A] p-5 mt-[40px] rounded-lg w-full py-[20px] h-auto text-[16px] text-center">
        소셜 계정으로 로그인하기
      </p>
    </form>
  );
};

export default LoginForm;
