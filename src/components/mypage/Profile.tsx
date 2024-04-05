'use client';

import { useState } from 'react';
import SchoolForm from './SchoolForm';
import { clientSupabase } from '(@/utils/supabase/client)';
import { userStore } from '(@/store/userStore)';
import AvatarForm from './AvatarForm';
import MyPost from './MyPost';
import Favorite from './Favorite';
import MetPeople from './MetPeople';

const Profile = () => {
  const [inputIntro, setInputIntro] = useState('' as string);
  const [inputKakaoId, setInputKakaoId] = useState('' as string);
  const [isEdting, setIsEdting] = useState(false);
  const [inputnickname, setInputNickname] = useState('' as string);

  const { user, setUser } = userStore((state) => state);

  const toggleEditing = () => {
    setIsEdting(!isEdting);
  };

  const onChangeNicknameInput = (e: any) => {
    setInputNickname(e.target.value);
  };

  // 자기소개 입력 변경 처리
  const onChangeIntroInput = (e: any) => {
    setInputIntro(e.target.value);
  };

  // 카카오ID 입력 변경 처리
  const onChangeKakaoIdInput = (e: any) => {
    setInputKakaoId(e.target.value);
  };

  /** 프로필 업데이트하는 로직 */
  const updateProfile = async () => {
    const userId = user && user[0].user_id;
    if (!userId) return;
    const { error } = await clientSupabase
      .from('users')
      .update({ intro: inputIntro, kakaoId: inputKakaoId })
      .eq('user_id', userId);
    if (error) {
      console.error('Error updating introduction:', error);
    } else {
      setUser([{ ...user[0], intro: inputIntro, kakaoId: inputKakaoId, nickname: inputnickname }]);
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
              value={inputnickname}
              onChange={onChangeNicknameInput}
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
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            id="kakaoId"
            placeholder=""
            value={inputKakaoId}
            onChange={onChangeKakaoIdInput}
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
            value={isEdting ? inputIntro : user && user[0].intro ? user[0].intro : ''}
            onChange={onChangeIntroInput}
          />
        )}
      </div>
      <MetPeople />
      <MyPost />
    </div>
  );
};

export default Profile;
