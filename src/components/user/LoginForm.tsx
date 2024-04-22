'use client';

import { clientSupabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Checkbox } from '@nextui-org/react';
import { googleLogin, kakaoLogin } from '@/utils/api/authAPI';
import { ValidationModal } from '../common/ValidationModal';
import { useModalStore } from '@/store/modalStore';
import { authValidation } from '@/utils/Validation';
import type { IsValidateShow, LoginDataType } from '@/types/userTypes';
import { useQueryClient } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import Link from 'next/link';
import Image from 'next/image';
import kakaoLoginLogo from '@/utils/icons/login_kakao.png';
import googleLoginLogo from '@/utils/icons/logo_google.png';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import cookie from 'react-cookies';
import { customErrToast } from '../common/customToast';

const LoginForm = () => {
  const queryClient = useQueryClient();

  const [loginData, setLoginData] = useState<LoginDataType>({ userId: '', password: '' });
  const [isValidateShow, setIsValidateShow] = useState<IsValidateShow>({
    userId: true,
    password: true
  });
  const [isError, setIsError] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [checkRememberId, setCheckRememberId] = useState(false);
  const { openModal } = useModalStore();

  const saveUserId = cookie.load('rememberUserId');

  useEffect(() => {
    if (saveUserId) {
      setLoginData((prev) => ({ ...prev, userId: saveUserId }));
      setCheckRememberId(true);
    }
  }, [saveUserId]);

  const showModal = () => {
    openModal({
      type: 'alert',
      name: '',
      text: '로그인 되었습니다.'
    });
  };

  const LOGIN_FORM_LIST = [
    {
      type: 'email',
      name: 'userId',
      placeholder: '이메일을 입력해주세요.',
      error: '이메일 형식으로 작성해주세요.'
    },
    {
      type: passwordShow ? 'text' : 'password',
      name: 'password',
      placeholder: '비밀번호를 입력해주세요.',
      error: '숫자, 문자, 특수문자 조합으로 8자이상 작성해 주세요.'
    }
  ];

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
        // 쿠키에 아이디 저장
        if (checkRememberId) {
          cookie.save('rememberUserId', loginData.userId, { path: '/' });
        } else {
          cookie.remove('rememberUserId', { path: '/' });
        }
        showModal();
      } else if (error) throw error;
    } catch (error: any) {
      if (error.message.includes('Invalid login')) {
        customErrToast('이메일 또는 비밀번호를 확인해주세요.');
        setIsError(true);
      } else {
        customErrToast('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  // 비밀번호 보이기 기능
  const togglePasswordShow = () => {
    setPasswordShow((prev) => !prev);
  };

  // 이메일 기억하기 기능
  const toggleCheckRemember = () => {
    setCheckRememberId((prev) => !prev);
  };

  return (
    <>
      <div className="max-w-[450px] w-full">
        <form className="flex flex-col gap-[8px]" onSubmit={onSubmitForm}>
          <div className="flex flex-col gap-[16px]">
            {LOGIN_FORM_LIST.map(({ type, name, placeholder, error }) => (
              <label key={name} className="relative">
                <input
                  className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-[#8F5DF4] w-full"
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  onChange={onChangeInput}
                  value={loginData[name]}
                  required
                />
                {name === 'password' && (
                  <button type="button" onClick={togglePasswordShow} className="absolute top-6 right-4">
                    {passwordShow ? <IoMdEye className="text-xl" /> : <IoMdEyeOff className="text-xl" />}
                  </button>
                )}
                {!isValidateShow[name] && <p className="text-red-500 text-[13px] mt-2">{error}</p>}
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Checkbox
              color="default"
              radius="sm"
              classNames={{
                label: 'text-[14px] text-gray3'
              }}
              isSelected={checkRememberId}
              onChange={toggleCheckRemember}
            >
              이메일 저장
            </Checkbox>
            <div className="flex gap-[4px]">
              <Link href="/forgotpassword" className="text-gray3 text-[14px]">
                비밀번호 찾기
              </Link>
            </div>
          </div>
          <Button
            className="duration-200 bg-mainColor text-white p-5 mt-[24px] rounded-lg font-semibold w-full py-[20px] h-auto text-base"
            type="submit"
          >
            로그인
          </Button>
        </form>
        {isError && <p className="text-red-500 text-[13px] mt-2">이메일 또는 비밀번호가 일치하지 않습니다.</p>}
        <div className="flex items-center gap-2 justify-center mt-[32px]">
          <p>아직 계정이 없다면?</p>
          <Link href="/join" className="text-[#27272A] rounded-lg h-auto text-[16px] underline" type="button">
            회원가입하기
          </Link>
        </div>
        <p className="duration-200 text-[#27272A] mt-[32px] mb-[16px] w-full h-auto text-[14px] text-center">
          소셜 계정으로 로그인하기
        </p>
        <div className="flex items-center justify-center gap-[16px]">
          <button className="rounded-full" onClick={googleLogin}>
            <Image src={googleLoginLogo} alt="google login" />
          </button>
          <button className="rounded-full" onClick={kakaoLogin}>
            <Image src={kakaoLoginLogo} alt="kakao login" />
          </button>
        </div>
      </div>

      <ValidationModal />
    </>
  );
};

export default LoginForm;
