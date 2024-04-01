import { clientSupabase } from '(@/utils/supabase/client)';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const JOIN_FORM_LIST = [
  {
    type: 'text',
    name: 'userId',
    placeholder: 'ID',
    error: 'E-Mail 형식으로 작성해 주세요.'
  },
  {
    type: 'password',
    name: 'password',
    placeholder: 'PassWord',
    error: '숫자, 문자, 특수문자 조합으로 8자이상 작성해 주세요.'
  },
  {
    type: 'text',
    name: 'nickname',
    placeholder: 'Nickname',
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

  const router = useRouter();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <form onSubmit={onSubmitForm}>
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
