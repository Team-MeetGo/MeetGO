'use client';

import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@nextui-org/react';

type Gender = 'male' | 'female' | '';

const JOIN_FORM_LIST = [
  {
    type: 'password',
    name: 'password',
    placeholder: '비밀번호를 입력해주세요.',
    error: '숫자, 문자, 특수문자 조합으로 8자이상 작성해 주세요.'
  },
  {
    type: 'text',
    name: 'nickname',
    placeholder: '닉네임을 입력해주세요.',
    error: '2 ~ 15자로 작성해 주세요.'
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

  console.log('gender', gender);
  return (
    <form onSubmit={onSubmitForm}>
      <label>
        <input type="text" name="userId" placeholder="이메일을 입력해주세요." onChange={onChangeInput} />
      </label>
      <label>
        <Button
          color={gender === 'female' ? 'primary' : 'default'}
          type="button"
          onClick={() => onGenderSelect('female')}
        >
          여자
        </Button>
        <Button color={gender === 'male' ? 'primary' : 'default'} type="button" onClick={() => onGenderSelect('male')}>
          남자
        </Button>
      </label>
      {JOIN_FORM_LIST.map(({ type, name, placeholder, error }) => (
        <label key={name}>
          <input type={type} name={name} placeholder={placeholder} onChange={onChangeInput} />
        </label>
      ))}

      <button type="submit">회원가입</button>
    </form>
  );
};

export default JoinForm;
