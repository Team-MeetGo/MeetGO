'use client';

import { emailConfirmAPI } from '(@/utils/api/emailConfirmAPI)';
import { Chip, Select, SelectItem } from '@nextui-org/react';
import { use, useEffect, useState } from 'react';
import SchoolForm from './SchoolForm';
import { getUserId } from '(@/utils/api/authAPI)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { userStore } from '(@/store/userStore)';

const Profile = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const userId = getUserId();
  const { user, setUser } = userStore((state) => state);

  async function getUserInfo(userId: string) {
    const { data, error } = await clientSupabase.from('users').select('*').eq('user_id', userId);
    console.log('data:', data);
    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
    return data;
  }

  /** 자기소개 업데이트하는 로직 */
  async function updateIntroduction(introduction: string) {
    const { error } = await clientSupabase.from('users').update({ intro: introduction }).eq('user_id', userId);
    if (error) {
      console.error('Error updating introduction:', error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="block text-base font-medium mb-1">{user && user[0].nickname}</p>
          <p className="block text-sm font-medium mb-1">{user && user[0].login_email}</p>
          <p className="block text-sm font-medium mb-1">{user && user[0].gender === 'female' ? '여성' : '남성'}</p>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-32 h-32 bg-gray-300" />
        </div>
      </div>
      <SchoolForm
        userSchoolEmail={user && user[0] && user[0].school_email}
        userSchoolName={user && user[0] && user[0].school_name}
        isValidate={user && user[0].isValidate}
      />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">카카오톡 ID</label>
        <p className="block text-sm font-medium mb-1">{user && user[0].kakaoId}</p>
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
        <p className="block text-sm font-medium mb-1">{user && user[0].kakaoId}</p>
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
