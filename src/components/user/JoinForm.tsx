'use client';

import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';

type Gender = 'male' | 'female' | '';

const JOIN_FORM_LIST = [
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

const JoinForm = () => {
  const [joinData, setJoinData] = useState({
    userId: '',
    password: '',
    nickname: '',
    gender: ''
  });
  const [isValidate, setIsValidate] = useState({
    userId: false,
    password: false,
    nickname: false
  });
  const [gender, setGender] = useState<Gender>('');

  const router = useRouter();

  const onGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
    setJoinData((prev) => ({ ...prev, gender: selectedGender }));
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJoinData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const {
        data: { session }
      } = await clientSupabase.auth.signUp({
        email: joinData.userId,
        password: joinData.password,
        options: {
          data: { nickname: joinData.nickname, gender: joinData.gender }
        }
      });
      if (session) {
        router.push('/');
      }
    } catch (error) {
      console.error('에러: ', error);
    }
  };

  return (
    <form className="max-w-[450px] flex flex-col gap-[20px] w-full" onSubmit={onSubmitForm}>
      <div className="flex gap-[10px] w-full">
        <label className="w-full mr-[10px]">
          <input
            className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-[#8F5DF4] w-full"
            type="text"
            name="nickname"
            placeholder="닉네임을 입력해주세요."
            onChange={onChangeInput}
          />
        </label>
        <Button
          className={
            gender === 'female'
              ? 'p-[20px] h-auto border min-w-0 rounded-lg bg-[#8F5DF4] text-white'
              : 'p-[20px] h-auto border min-w-0 rounded-lg border-[#A1A1AA]'
          }
          color={gender === 'female' ? 'secondary' : 'default'}
          variant={gender === 'female' ? 'solid' : 'bordered'}
          type="button"
          onClick={() => onGenderSelect('female')}
        >
          여자
        </Button>
        <Button
          className={
            gender === 'male'
              ? 'p-[20px] h-auto border min-w-0 rounded-lg bg-[#8F5DF4] text-white'
              : 'p-[20px] h-auto border min-w-0 rounded-lg border-[#A1A1AA]'
          }
          variant={gender === 'male' ? 'solid' : 'bordered'}
          type="button"
          onClick={() => onGenderSelect('male')}
        >
          남자
        </Button>
      </div>
      {JOIN_FORM_LIST.map(({ type, name, placeholder, error }) => (
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
        className="duration-200 bg-[#8F5DF4] text-white p-5 mt-[10px] rounded-lg font-semibold w-full py-[20px] h-auto text-[16px]"
        type="submit"
      >
        회원가입
      </Button>
    </form>
  );
};

export default JoinForm;
