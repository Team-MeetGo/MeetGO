'use client';

import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { authValidation } from '(@/utils/Validation)';
import { IsValidateShow } from '(@/types/userTypes)';
import { ValidationModal } from '../common/ValidationModal';
import { useModalStore } from '(@/store/modalStore)';
import { IoFemale, IoMale } from 'react-icons/io5';

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
  const [isValidateShow, setIsValidateShow] = useState<IsValidateShow>({
    userId: true,
    password: true,
    nickname: true
  });
  const [gender, setGender] = useState<Gender>('');
  const router = useRouter();
  const { openModal } = useModalStore();

  const showModal = () => {
    openModal({
      type: 'alert',
      name: '',
      text: '회원가입 되었습니다.',
      onFunc: () => {}
    });
  };

  const onGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
    setJoinData((prev) => ({ ...prev, gender: selectedGender }));
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJoinData((prev) => ({ ...prev, [name]: value }));
    if (value === '') return setIsValidateShow((prev) => ({ ...prev, [name]: true }));
    const isValid = authValidation(name, value); // 유효성 검사 수행
    setIsValidateShow((prev) => ({ ...prev, [name]: isValid })); // 결과 반영
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isAllValid = Object.values(isValidateShow).every((v) => v); // 모든 유효성 검사가 통과되었는지 확인
    if (!isAllValid) return; // 통과되지 않았다면 회원가입 진행을 막음

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
        showModal();
      } else if (error) {
        throw error;
      }
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        alert('이미 존재하는 계정입니다.');
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
      <form className="max-w-[450px] flex flex-col gap-[16px] w-full" onSubmit={onSubmitForm}>
        <div>
          <div className="flex gap-[16px] w-full">
            <label key="nickname" className="w-full">
              <input
                className="p-5 border border-[#A1A1AA] placeholder:text-[#A1A1AA] placeholder:text-[14px] rounded-lg focus:outline-none focus:border-[#8F5DF4] w-full"
                type="text"
                name="nickname"
                placeholder="닉네임을 입력해주세요."
                onChange={onChangeInput}
                required
              />
            </label>
            <div className="flex gap-[8px]">
              <Button
                className={
                  gender === 'female'
                    ? 'px-[16px] py-[20px] h-auto border min-w-0 rounded-lg bg-[#8F5DF4] text-white'
                    : 'px-[16px] py-[20px] h-auto border min-w-0 rounded-lg border-[#A1A1AA]'
                }
                color={gender === 'female' ? 'secondary' : 'default'}
                variant={gender === 'female' ? 'solid' : 'bordered'}
                type="button"
                onClick={() => onGenderSelect('female')}
              >
                <IoFemale />
              </Button>
              <Button
                className={
                  gender === 'male'
                    ? 'px-[16px] py-[20px] h-auto border min-w-0 rounded-lg bg-[#8F5DF4] text-white'
                    : 'px-[16px] py-[20px] h-auto border min-w-0 rounded-lg border-[#A1A1AA]'
                }
                variant={gender === 'male' ? 'solid' : 'bordered'}
                type="button"
                onClick={() => onGenderSelect('male')}
              >
                <IoMale className="w-[4px]" />
              </Button>
            </div>
          </div>
          {!isValidateShow.nickname && (
            <p className="text-red-500 text-[13px] mt-2">닉네임은 2-12글자 이내로 작성해주세요. </p>
          )}
        </div>
        {JOIN_FORM_LIST.map(({ type, name, placeholder, error }) => (
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
          className="duration-200 bg-[#8F5DF4] text-white p-5 mt-[16px] rounded-lg font-semibold w-full py-[20px] h-auto text-[16px]"
          type="submit"
        >
          회원가입
        </Button>
      </form>
      <ValidationModal />
    </>
  );
};

export default JoinForm;
