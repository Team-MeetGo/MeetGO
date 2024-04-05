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
  const [intro, setIntro] = useState('' as string);
  const [inputKakaoId, setInputKakaoId] = useState('' as string);
  const [kakaoId, setKakaoId] = useState('' as string);
  const [isKakaoEditing, setIsKakaoEditing] = useState(false);
  const [isIntroEditing, setIsIntroEditing] = useState(false);

  const { user, setUser } = userStore((state) => state);

  const toggleKakaoEditing = () => {
    setIsKakaoEditing(!isKakaoEditing);
  };

  const toggleIntroEditing = () => {
    setIsIntroEditing(!isIntroEditing);
  };

  // 자기소개 입력 변경 처리
  const onChangeIntroInput = (e: any) => {
    setInputIntro(e.target.value);
  };

  // 카카오ID 입력 변경 처리
  const onChangeKakaoIdInput = (e: any) => {
    setInputKakaoId(e.target.value);
  };

  /** 자기소개 업데이트하는 로직 */
  const updateIntroduction = async () => {
    const userId = user && user[0].user_id;
    if (!userId) return;
    const { error } = await clientSupabase.from('users').update({ intro: inputIntro }).eq('user_id', userId);
    if (error) {
      console.error('Error updating introduction:', error);
    } else {
      setIntro(inputIntro);
      setIsIntroEditing(false);
      setUser([{ ...user[0], intro: inputIntro }]);
    }
  };

  /** 카카오ID 업데이트하는 로직 */
  const updateKakaoId = async () => {
    const userId = user && user[0].user_id;
    if (!userId) return;
    const { error } = await clientSupabase.from('users').update({ kakaoId: inputKakaoId }).eq('user_id', userId);
    if (error) {
      console.error('Error updating kakaoId:', error);
    } else {
      setKakaoId(inputKakaoId);
      setIsKakaoEditing(false);
      setUser([{ ...user[0], kakaoId: inputKakaoId }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="block text-base font-medium mb-1">{user && user[0].nickname}</p>
          <p className="block text-sm font-medium mb-1">{user && user[0].login_email}</p>
          <p className="block text-sm font-medium mb-1">{user && user[0].gender === 'female' ? '여성' : '남성'}</p>
        </div>
        <AvatarForm />
      </div>
      <SchoolForm />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">카카오톡ID</label>
        {user && user[0].kakaoId && !isKakaoEditing ? (
          <>
            <button className="text-xs" onClick={toggleKakaoEditing}>
              수정하기
            </button>
            <p className="block text-sm font-medium mb-1">{user[0].kakaoId}</p>
          </>
        ) : (
          <>
            <button className="text-xs" onClick={updateKakaoId}>
              등록하기
            </button>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              id="kakaoId"
              placeholder=""
              value={inputKakaoId}
              onChange={onChangeKakaoIdInput}
            />
          </>
        )}
      </div>
      <Favorite />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="introduction">
          자기소개(최대 10자)
        </label>
        {user && user[0].intro && !isIntroEditing ? (
          <>
            <button className="text-xs" onClick={toggleIntroEditing}>
              수정하기
            </button>
            <p className="block text-sm font-medium mb-1">{user[0].intro}</p>
          </>
        ) : (
          <>
            <button className="text-xs" onClick={updateIntroduction}>
              등록하기
            </button>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              id="introduction"
              placeholder="자기소개를 입력해주세요."
              value={isIntroEditing ? inputIntro : user && user[0].intro ? user[0].intro : ''}
              onChange={onChangeIntroInput}
            />
          </>
        )}
      </div>
      <MetPeople />
      <MyPost />
    </div>
  );
};

export default Profile;
