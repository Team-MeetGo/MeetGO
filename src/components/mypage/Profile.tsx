'use client';

import { Suspense, useState } from 'react';
import SchoolForm from './SchoolForm';
import { clientSupabase } from '(@/utils/supabase/client)';
import { userStore } from '(@/store/userStore)';
import AvatarForm from './AvatarForm';
import MyPost from './MyPost';
import Favorite from './Favorite';
import MetPeople from './MetPeople';
import useInputChange from '(@/hooks/custom/useInputChange)';
import { Select, SelectItem } from '@nextui-org/react';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';

const Profile = () => {
  // const { user, setUser } = userStore((state) => state);
  const { data: userData, isPending, isError, error } = useGetUserDataQuery();

  const [isEditing, setIsEditing] = useState(false);
  const inputNickname = useInputChange(userData?.nickname ? userData?.nickname : '');
  const inputIntro = useInputChange(userData?.intro ? userData?.intro : '');
  const inputKakaoId = useInputChange(userData?.kakaoId ? userData?.kakaoId : '');
  const inputGender = useInputChange(userData?.gender ? userData?.gender : '');

  const toggleEditing = () => {
    setIsEditing(true);
    if (userData) {
      inputNickname.setValue(userData?.nickname);
      inputIntro.setValue(userData?.intro);
      inputKakaoId.setValue(userData?.kakaoId);
    }
  };

  const onCancelHandle = () => {
    setIsEditing(false);
  };

  /** 프로필 업데이트하는 로직 */
  const updateProfile = async () => {
    const userId = userData?.user_id;
    if (!userId) return;
    /** 닉네임 중복 검사 로직 */
    const { data: nicknameData, error: nicknameError } = await clientSupabase
      .from('users')
      .select('nickname')
      .eq('nickname', inputNickname.value)
      .not('user_id', 'eq', userData?.user_id);
    if (nicknameError) {
      console.error('Error fetching:', nicknameError);
      return;
    }
    if (nicknameData.length > 0) {
      alert('이미 사용중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
      return;
    }

    const { error } = await clientSupabase
      .from('users')
      .update({
        intro: inputIntro.value,
        kakaoId: inputKakaoId.value,
        nickname: inputNickname.value,
        gender: inputGender.value
      })
      .eq('user_id', userId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      {isEditing ? (
        <>
          <button className="border p-4" onClick={updateProfile}>
            저장하기
          </button>
          <button className="border p-4" onClick={onCancelHandle}>
            취소
          </button>
        </>
      ) : (
        <button className="border p-4" onClick={toggleEditing}>
          수정하기
        </button>
      )}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          {!isEditing ? (
            <p className="block text-base font-medium mb-1">{userData?.nickname}</p>
          ) : (
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              id="nickname"
              placeholder="닉네임 입력 (최대 10자)"
              type="text"
              value={inputNickname.value}
              onChange={inputNickname.onChange}
            />
          )}
          <p className="block text-sm font-medium mb-1">{userData?.login_email}</p>
          <p className="block text-sm font-medium mb-1">
            {userData
              ? userData?.gender === 'female'
                ? '여성'
                : userData?.gender === 'male'
                ? '남성'
                : '성별을 골라주세요.'
              : '사용자 정보 없음'}
          </p>
          {isEditing && (
            <Select label="성별" className="max-w-xs" onChange={inputGender.onChange}>
              <SelectItem key="female" value="female">
                여성
              </SelectItem>
              <SelectItem key="male" value="male">
                남성
              </SelectItem>
            </Select>
          )}
        </div>
        <AvatarForm />
      </div>
      <SchoolForm />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">카카오톡ID</label>
        {!isEditing ? (
          <p className="block text-sm font-medium mb-1">{userData?.kakaoId}</p>
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
      <Favorite isEditing={isEditing} />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="introduction">
          자기소개(최대 15자)
        </label>
        {!isEditing ? (
          <p className="block text-sm font-medium mb-1">{userData?.intro}</p>
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
      <Suspense fallback={<div>Loading...</div>}>
        <MetPeople />
      </Suspense>
      <MyPost />
    </div>
  );
};

export default Profile;
