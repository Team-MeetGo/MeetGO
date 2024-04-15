'use client';

import { useState } from 'react';
import SchoolForm from './SchoolForm';
import AvatarForm from './AvatarForm';
import MyPost from './MyPost';
import Favorite from './Favorite';
import MetPeople from './MetPeople';
import useInputChange from '@/hooks/custom/useInputChange';
import { Avatar, Select, SelectItem } from '@nextui-org/react';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useProfileUpdateMutation } from '@/hooks/useMutation/useProfileMutation';
import { useQueryClient } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import { UpdateProfileType } from '@/types/userTypes';
import Image from 'next/image';
import { profileCount, useFavoriteStore } from '@/store/userStore';

const Profile = () => {
  const queryClient = useQueryClient();
  const { data: user, isPending, isError, error } = useGetUserDataQuery();
  const [isEditing, setIsEditing] = useState(false);
  const inputNickname = useInputChange(user?.nickname ? user?.nickname : '');
  const inputIntro = useInputChange(user?.intro ? user?.intro : '');
  const inputKakaoId = useInputChange(user?.kakaoId ? user?.kakaoId : '');
  const inputGender = useInputChange(user?.gender ? user?.gender : '');
  const { postCount, likedPostCount, metPeopleCount, meetingRoomCount } = profileCount();
  const { selected } = useFavoriteStore();

  const { mutate: updateProfileMutate } = useProfileUpdateMutation();

  const toggleEditing = () => {
    setIsEditing(true);
    if (user) {
      inputNickname.setValue(user?.nickname);
      inputIntro.setValue(user?.intro);
      inputKakaoId.setValue(user?.kakaoId);
      inputGender.setValue(user?.gender);
    }
  };

  const onCancelHandle = () => {
    setIsEditing(false);
  };

  /** 수정하고 저장버튼 클릭시 실행될 로직(상태 업데이트 및 갱신) */
  const handleProfileUpdate = ({ userId, inputNickname, inputIntro, inputKakaoId, inputGender }: UpdateProfileType) => {
    updateProfileMutate(
      { userId, inputNickname, inputIntro, inputKakaoId, inputGender, favorite: Array.from(selected) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [USER_DATA_QUERY_KEY]
          });
          setIsEditing(false);
        }
      }
    );
  };

  const joinTime = user?.created_at?.toString().slice(0, 10);

  const buttonData = [
    { title: '스쳐간 인연', count: metPeopleCount },
    { title: '참여한 미팅방', count: meetingRoomCount },
    { title: '작성 글', count: postCount },
    { title: '좋아요한 글', count: likedPostCount }
  ];

  return (
    <div className="mx-auto bg-white">
      <div className="bg-purpleSecondary w-full py-[40px]">
        <div className="flex flex-col gap-4 max-w-[1161px] m-auto">
          <span className="text-[42px] font-bold">프로필</span>
          <div className="flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <div className="w-[180px] h-[180px] overflow-hidden flex justify-center items-center rounded-full relative">
                {user?.avatar ? (
                  <Image
                    src={`${user?.avatar}?${new Date().getTime()}`}
                    alt="Avatar"
                    style={{ objectFit: 'cover' }}
                    fill={true}
                    sizes="500px"
                    priority={true}
                  />
                ) : (
                  <Avatar color="secondary" className="w-32 h-32" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="block text-2xl font-semibold">{user?.nickname}</p>
                <p className="block text-lg font-medium">{user?.login_email}</p>
                <p className="font-medium text-gray3 text-sm">가입일 : {joinTime}</p>
              </div>
            </div>
            <div className="flex gap-6">
              {buttonData.map((item, index) => (
                <button key={index} className="font-semibold">
                  <p>{item.title}</p>
                  <p className="font-bold text-3xl">{item.count}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[800px] m-auto pt-[40px] flex flex-col gap-6">
        <div className="flex gap-6">
          <p className="text-lg font-semibold w-[100px]">사진</p>
          <div className="flex flex-col items-start">
            <AvatarForm />
            <p className="text-sm text-[#A1A1AA] mt-2">프로필 사진의 권장 크기는 100MB입니다.</p>
            <p className="text-sm text-[#A1A1AA]">지원하는 파일 형식 : jpg, png, gif</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <p className="block text-lg font-semibold w-[100px]">닉네임</p>
          {!isEditing ? (
            <p className="block text-base font-medium">{user?.nickname}</p>
          ) : (
            <input
              className="max-w-full p-2 border border-gray-300 rounded-md"
              id="nickname"
              placeholder="닉네임 입력 (최대 10자)"
              type="text"
              value={inputNickname.value}
              onChange={inputNickname.onChange}
            />
          )}
        </div>
        <div className="flex items-center gap-6">
          <p className="block text-lg font-semibold w-[100px]">이메일</p>
          <p className="block text-base font-medium">{user?.login_email}</p>
        </div>
        <div className="flex items-center gap-6">
          <p className="block text-lg font-semibold w-[100px]">성별</p>
          <p className="block text-base font-medium">
            {user
              ? user?.gender === 'female'
                ? '여성'
                : user?.gender === 'male'
                ? '남성'
                : '성별을 골라주세요.'
              : '사용자 정보 없음'}
          </p>
        </div>
        {isEditing && (
          <Select label="성별" className="max-w-xs" value={inputGender.value} onChange={inputGender.onChange}>
            <SelectItem key="female" value="female">
              여성
            </SelectItem>
            <SelectItem key="male" value="male">
              남성
            </SelectItem>
          </Select>
        )}
        <SchoolForm />
        <div className="mb-6 flex items-center gap-6">
          <label className="block text-lg font-semibold w-[100px]">카카오톡ID</label>
          {!isEditing ? (
            <p className="block text-sm font-medium mb-1">{user?.kakaoId}</p>
          ) : (
            <input
              className="max-w-full p-2 border border-gray-300 rounded-md"
              id="kakaoId"
              placeholder=""
              type="text"
              value={inputKakaoId.value}
              onChange={inputKakaoId.onChange}
            />
          )}
        </div>
        <Favorite isEditing={isEditing} />
        <div className="flex gap-6 items-center">
          <label className="block text-lg font-semibold w-[100px]" htmlFor="introduction">
            자기소개
          </label>
          {!isEditing ? (
            <p className="block text-sm font-medium mb-1">{user?.intro}</p>
          ) : (
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              id="introduction"
              placeholder="자기소개를 입력해주세요. 예)MBTI, 취미, 관심사 등"
              value={inputIntro.value}
              onChange={inputIntro.onChange}
              maxLength={15}
            />
          )}
        </div>
        <div className="flex justify-center">
          {isEditing ? (
            <>
              <button
                className="border p-4"
                onClick={() =>
                  handleProfileUpdate({
                    userId: user!.user_id,
                    inputNickname: inputNickname.value,
                    inputIntro: inputIntro.value,
                    inputKakaoId: inputKakaoId.value,
                    inputGender: inputGender.value,
                    favorite: Array.from(selected)
                  })
                }
              >
                저장하기
              </button>
              <button className="border p-4" onClick={onCancelHandle}>
                취소
              </button>
            </>
          ) : (
            <button
              className="bg-mainColor rounded-[12px] px-[20px] py-[12px] text-[18px] text-white font-medium"
              onClick={toggleEditing}
            >
              수정하기
            </button>
          )}
        </div>
        <MetPeople />
        <MyPost />
      </div>
    </div>
  );
};

export default Profile;
