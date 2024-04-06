'use client';

import { useState } from 'react';
import SchoolForm from './SchoolForm';
import { clientSupabase } from '(@/utils/supabase/client)';
import { userStore } from '(@/store/userStore)';
import AvatarForm from './AvatarForm';
import MyPost from './MyPost';
import Favorite from './Favorite';
import MetPeople from './MetPeople';
import useInputChange from '(@/hooks/useInputChange)';

const Profile = () => {
  const { user, setUser } = userStore((state) => state);
  const [isEdting, setIsEdting] = useState(false);
  const inputNickname = useInputChange(user && user[0].nickname ? user[0].nickname : '');
  const inputIntro = useInputChange(user && user[0].intro ? user[0].intro : '');
  const inputKakaoId = useInputChange(user && user[0].kakaoId ? user[0].kakaoId : '');

  const toggleEditing = () => {
    setIsEdting(true);
    if (user && user[0]) {
      inputNickname.setValue(user && user[0].nickname);
      inputIntro.setValue(user && user[0].intro);
      inputKakaoId.setValue(user && user[0].kakaoId);
    }
  };

  /** 프로필 업데이트하는 로직 */
  const updateProfile = async () => {
    const userId = user && user[0].user_id;
    if (!userId) return;
    const { error } = await clientSupabase
      .from('users')
      .update({ intro: inputIntro.value, kakaoId: inputKakaoId.value, nickname: inputNickname.value })
      .eq('user_id', userId);
    if (error) {
      console.error('Error updating introduction:', error);
    } else {
      setUser([{ ...user[0], intro: inputIntro.value, kakaoId: inputKakaoId.value, nickname: inputNickname.value }]);
      setIsEdting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      {isEdting ? (
        <button className="border p-4" onClick={updateProfile}>
          저장하기
        </button>
      ) : (
        <button className="border p-4" onClick={toggleEditing}>
          수정하기
        </button>
      )}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          {user && user[0].nickname && !isEdting ? (
            <p className="block text-base font-medium mb-1">{user && user[0].nickname}</p>
          ) : (
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              id="nickname"
              placeholder=""
              type="text"
              value={inputNickname.value}
              onChange={inputNickname.onChange}
            />
          )}
          <p className="block text-sm font-medium mb-1">{user && user[0].login_email}</p>
          <p className="block text-sm font-medium mb-1">{user && user[0].gender === 'female' ? '여성' : '남성'}</p>
        </div>
        <AvatarForm />
      </div>
      <SchoolForm />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">카카오톡ID</label>
        {user && user[0].kakaoId && !isEdting ? (
          <p className="block text-sm font-medium mb-1">{user[0].kakaoId}</p>
        ) : (
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            id="kakaoId"
            placeholder=""
            type="text"
            value={inputKakaoId.value}
            onChange={inputKakaoId.onChange}
          />
        )}
      </div>
      <Favorite />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="introduction">
          자기소개(최대 15자)
        </label>
        {user && user[0].intro && !isEdting ? (
          <p className="block text-sm font-medium mb-1">{user[0].intro}</p>
        ) : (
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            id="introduction"
            placeholder="자기소개를 입력해주세요. 예)MBTI, 취미, 관심사 등"
            value={inputIntro.value}
            onChange={inputIntro.onChange}
          />
        )}
      </div>
      <MetPeople />
      <MyPost />
    </div>
  );
};

export default Profile;
