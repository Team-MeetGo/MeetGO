'use client';

import { clientSupabase } from '@/utils/supabase/client';
import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { authValidation } from '@/utils/Validation';
import type { Gender, IsValidateShow, JoinDataType } from '@/types/userTypes';
import { ValidationModal } from '../common/ValidationModal';
import { useModalStore } from '@/store/modalStore';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import Link from 'next/link';
import { customErrToast } from '../common/customToast';

const JoinForm = () => {
  const [joinData, setJoinData] = useState<JoinDataType>({
    userId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    gender: ''
  });
  const [isValidateShow, setIsValidateShow] = useState<IsValidateShow>({
    userId: true,
    password: true,
    confirmPassword: true,
    nickname: true
  });
  const [gender, setGender] = useState<Gender>('');
  const [passwordShow, setPasswordShow] = useState(false);
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();

  const JOIN_FORM_LIST = [
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
    },
    {
      type: passwordShow ? 'text' : 'password',
      name: 'confirmPassword',
      placeholder: '비밀번호를 다시 입력해주세요.',
      error: '비밀번호가 일치하지 않습니다.'
    }
  ];

  const showModal = () => {
    openModal({
      type: 'alert',
      name: '',
      text: '회원가입 되었습니다.'
    });
  };

  const onGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
    setJoinData((prev) => ({ ...prev, gender: selectedGender }));
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJoinData((prev) => ({ ...prev, [name]: value }));

    if (value === '') {
      setIsValidateShow((prev) => ({ ...prev, [name]: true }));
    } else {
      // 비밀번호 확인 필드인 경우에만 비밀번호와의 일치 여부도 확인
      if (name === 'confirmPassword') {
        const isValid = authValidation(name, value, joinData.password);
        setIsValidateShow((prev) => ({ ...prev, [name]: isValid }));
      } else {
        const isValid = authValidation(name, value);
        setIsValidateShow((prev) => ({ ...prev, [name]: isValid }));
      }
    }
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: nicknameData, error: nicknameError } = await clientSupabase
        .from('users')
        .select('nickname')
        .eq('nickname', joinData.nickname)
        .single();

      if (nicknameData) {
        customErrToast('이미 사용중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
        return;
      }
    } catch (error) {
      console.error('Error during nickname validation:', error);
      customErrToast('닉네임 중복 검사 중 예상치 못한 오류가 발생했습니다.');
      return;
    }

    const isAllValid = Object.values(isValidateShow).every((v) => v); // 모든 유효성 검사가 통과되었는지 확인
    if (!isAllValid) return; // 통과되지 않았다면 회원가입 진행을 막음

    if (joinData.password !== joinData.confirmPassword) {
      setIsValidateShow((prev) => ({ ...prev, confirmPassword: false }));
      return;
    } // 비밀번호 확인 불일치 시 회원가입 X

    try {
      const {
        data: { session },
        error
      } = await clientSupabase.auth.signUp({
        email: joinData.userId,
        password: joinData.password,
        options: {
          data: { nickname: joinData.nickname, gender: joinData.gender }
        }
      });
      if (session) {
        queryClient.invalidateQueries({
          queryKey: [USER_DATA_QUERY_KEY]
        });
        showModal();
      } else if (error) {
        throw error;
      }
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        customErrToast('이미 존재하는 계정입니다.');
      } else {
        customErrToast('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  const togglePasswordShow = () => {
    setPasswordShow((prev) => !prev);
  };

  return (
    <>
      <form className="max-w-[450px] flex flex-col gap-[16px] w-full px-6" onSubmit={onSubmitForm}>
        <div>
          <div className="flex gap-[16px] w-full">
            <label key="nickname" className="w-full">
              <input
                className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-mainColor w-full"
                type="text"
                name="nickname"
                placeholder="닉네임을 입력해주세요."
                onChange={onChangeInput}
                maxLength={12}
                required
              />
            </label>
            <div className="flex gap-[8px]">
              <Button
                className={
                  gender === 'female'
                    ? 'px-[16px] py-[20px] h-auto border min-w-0 rounded-lg bg-mainColor text-white'
                    : 'px-[16px] py-[20px] h-auto border min-w-0 rounded-lg border-[#A1A1AA]'
                }
                color={gender === 'female' ? 'secondary' : 'default'}
                variant={gender === 'female' ? 'solid' : 'bordered'}
                type="button"
                onClick={() => onGenderSelect('female')}
              >
                여성
              </Button>
              <Button
                className={
                  gender === 'male'
                    ? 'px-[16px] py-[20px] h-auto border min-w-0 rounded-lg bg-mainColor text-white'
                    : 'px-[16px] py-[20px] h-auto border min-w-0 rounded-lg border-[#A1A1AA]'
                }
                variant={gender === 'male' ? 'solid' : 'bordered'}
                type="button"
                onClick={() => onGenderSelect('male')}
              >
                남성
              </Button>
            </div>
          </div>
          {!isValidateShow.nickname && (
            <p className="text-red-500 text-[13px] mt-2">닉네임은 2-12글자 이내로 작성해주세요. </p>
          )}
        </div>
        {JOIN_FORM_LIST.map(({ type, name, placeholder, error }) => (
          <label key={name} className="relative">
            <input
              className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-mainColor w-full"
              type={type}
              name={name}
              placeholder={placeholder}
              onChange={onChangeInput}
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
        <Button
          className="duration-200 bg-mainColor text-white p-5 mt-[16px] rounded-lg font-semibold w-full py-[20px] h-auto text-[16px]"
          type="submit"
        >
          회원가입
        </Button>
      </form>
      <div className="flex items-center gap-2 justify-center mt-[8px]">
        <p>이미 계정이 있다면?</p>
        <Link href="/login" className="text-[#27272A] rounded-lg h-auto text-[16px] underline" type="button">
          로그인하기
        </Link>
      </div>
    </>
  );
};

export default JoinForm;
