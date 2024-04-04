'use client';

import { emailConfirmAPI } from '(@/utils/api/emailConfirmAPI)';
import { Chip, Select, SelectItem } from '@nextui-org/react';
import { use, useEffect, useState } from 'react';
import SchoolForm from './SchoolForm';
import { getUserId } from '(@/utils/api/authAPI)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { userStore } from '(@/store/userStore)';
import AvatarForm from './AvatarForm';

const Profile = () => {
  const [inputIntro, setInputIntro] = useState('' as string);
  const [intro, setIntro] = useState('' as string);
  const [inputKakaoId, setInputKakaoId] = useState('' as string);
  const [kakaoId, setKakaoId] = useState('' as string);
  const [isEditing, setIsEditing] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { user, setUser } = userStore((state) => state);

  // async function getUserInfo(userId: string) {
  //   const { data, error } = await clientSupabase.from('users').select('*').eq('user_id', userId);
  //   console.log('data:', data);
  //   if (error) {
  //     console.error('Error fetching user data:', error);
  //     return null;
  //   }
  //   return data;
  // }

  const toggleEditing = () => {
    setIsEditing(!isEditing);
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
    const { result: userId } = await getUserId();
    const { error } = await clientSupabase.from('users').update({ intro: inputIntro }).eq('user_id', userId);
    if (error) {
      console.error('Error updating introduction:', error);
    } else {
      setIntro(inputIntro);
      setIsEditing(false);
    }
  };

  /** 카카오ID 업데이트하는 로직 */
  const updateKakaoId = async () => {
    const { result: userId } = await getUserId();
    const { error } = await clientSupabase.from('users').update({ kakaoId: inputKakaoId }).eq('user_id', userId);
    if (error) {
      console.error('Error updating kakaoId:', error);
    } else {
      setKakaoId(inputKakaoId);
      setIsEditing(false);
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
        {user && user[0].kakaoId && !isEditing ? (
          <>
            <button className="text-xs" onClick={toggleEditing}>
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
      <div className="mb-6">
        <label>취향</label>
        {/* <Select selectedKeys={selected} onSelectionChange={setSelected}>
          <SelectItem key="180cm" value="1">
            180cm
          </SelectItem>
          <SelectItem key="비흡연자" value="2">
            비흡연자
          </SelectItem>
          <SelectItem key="다정함" value="3">
            다정함
          </SelectItem>
        </Select>
        <Chip className="bg-[#8F5DF4]">{selected}</Chip> */}
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="introduction">
          자기소개(최대 10자)
        </label>
        {user && user[0].intro && !isEditing ? (
          <>
            <button className="text-xs" onClick={toggleEditing}>
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
              value={isEditing ? inputIntro : user && user[0].intro ? user[0].intro : ''}
              onChange={onChangeIntroInput}
            />
          </>
        )}
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">스쳐간 인연 리스트</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
            <p className="text-sm">닉네임</p>
            <button className="text-xs">카톡ID요청하기</button>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
            <p className="text-sm">닉네임</p>
            <button className="text-xs">카톡ID요청하기</button>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
            <p className="text-sm">닉네임</p>
            <button className="text-xs">카톡ID요청하기</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">내가 쓴 글</h2>
          <div className="w-full h-32 bg-gray-300 mb-2" />
          <div className="w-full h-32 bg-gray-300" />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">좋아요한 글</h2>
          <div className="w-full h-32 bg-gray-300 mb-2" />
          <div className="w-full h-32 bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
