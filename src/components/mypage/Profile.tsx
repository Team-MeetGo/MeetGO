'use client';

import { emailConfirmAPI } from '(@/utils/api/emailConfirmAPI)';
import { Chip, Select, SelectItem } from '@nextui-org/react';
import { useState } from 'react';
import SchoolForm from './SchoolForm';

const Profile = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">프로필</h1>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="nickname">
            닉네임
          </label>
          <input id="nickname" placeholder="아이디 | 닉네임" />
        </div>
        <div className="flex justify-center items-center">
          <div className="w-32 h-32 bg-gray-300" />
        </div>
      </div>
      <SchoolForm />
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="kakaoId">
          카카오톡 ID
        </label>
        <input id="kakaoId" placeholder="" />
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
        <input id="introduction" placeholder="소개 내용을 입력해주세요." />
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
