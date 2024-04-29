'use client';

import { useState } from 'react';
import SchoolForm from './SchoolForm';
import AvatarForm from './AvatarForm';
import MyPost from './MyPost';
import Favorite from './Favorite';
import MetPeople from './MetPeople';
import useInputChange from '@/hooks/custom/useInputChange';
import { Select, SelectItem } from '@nextui-org/react';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useProfileUpdateMutation } from '@/hooks/useMutation/useProfileMutation';
import { useQueryClient } from '@tanstack/react-query';
import { USER_DATA_QUERY_KEY } from '@/query/user/userQueryKeys';
import type { UpdateProfileType } from '@/types/userTypes';
import { useFavoriteStore } from '@/store/userStore';
import ProfileHeader from './ProfileHeader';
import { deleteUser } from '@/utils/api/authAPI';
import { ValidationModal } from '../common/ValidationModal';
import { useModalStore } from '@/store/modalStore';

const Profile = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUserDataQuery();
  const [isEditing, setIsEditing] = useState(false);
  const inputNickname = useInputChange('');
  const inputIntro = useInputChange('');
  const inputKakaoId = useInputChange('');
  const inputGender = useInputChange('');
  const { selected } = useFavoriteStore();
  const { openModal, closeModal } = useModalStore();

  const { mutate: updateProfileMutate } = useProfileUpdateMutation();

  if (!user) return null;

  const toggleEditing = () => {
    setIsEditing(true);
    if (user) {
      inputNickname.setValue(user.nickname);
      inputIntro.setValue(user.intro);
      inputKakaoId.setValue(user.kakaoId);
      inputGender.setValue(user.gender);
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

  const handleDeleteUser = (userId: string) => {
    openModal({
      type: 'confirm',
      name: '회원탈퇴',
      text: '정말 탈퇴하시겠습니까?',
      onFunc: () => {
        deleteUser(userId);
        closeModal();
        location.replace('/');
      },
      onCancelFunc: () => {
        closeModal();
      }
    });
  };

  return (
    <div className="mx-auto bg-white ">
      <ProfileHeader />
      <div className="max-w-[800px] m-auto py-[40px] px-[24px] flex flex-col gap-6">
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
            <p className="block text-base font-medium">{user.nickname}</p>
          ) : (
            <input
              className="max-w-full p-2 border border-gray-300 rounded-md"
              id="nickname"
              placeholder="닉네임 입력 (최대 12자)"
              type="text"
              value={inputNickname.value}
              onChange={inputNickname.onChange}
              maxLength={12}
            />
          )}
        </div>
        <div className="flex items-center gap-6">
          <p className="block text-lg font-semibold w-[100px]">이메일</p>
          <p className="block text-base font-medium">{user.login_email}</p>
        </div>
        <div className={`${isEditing ? 'items-start' : 'items-center'} flex gap-6 w-full`}>
          <p className="block text-lg font-semibold w-[100px]">성별</p>
          <div className="flex flex-col gap-2">
            <p className="block text-base font-medium">
              {user
                ? user.gender === 'female'
                  ? '여성'
                  : user.gender === 'male'
                  ? '남성'
                  : '성별을 골라주세요.'
                : '사용자 정보 없음'}
            </p>
            {isEditing && !user.gender && (
              <Select
                label="성별"
                className="min-w-36 max-w-xs"
                value={inputGender.value}
                onChange={inputGender.onChange}
              >
                <SelectItem key="female" value="female">
                  여성
                </SelectItem>
                <SelectItem key="male" value="male">
                  남성
                </SelectItem>
              </Select>
            )}
          </div>
        </div>

        <SchoolForm />
        <div className="flex items-center gap-6">
          <label className="block text-lg font-semibold w-[100px]">카카오톡ID</label>
          {!isEditing ? (
            <p className="block text-sm font-medium mb-1">{user.kakaoId}</p>
          ) : (
            <input
              className="max-w-full p-2 border border-gray-300 rounded-md"
              id="kakaoId"
              placeholder=""
              type="text"
              value={inputKakaoId.value}
              onChange={inputKakaoId.onChange}
              maxLength={20}
            />
          )}
        </div>
        <Favorite isEditing={isEditing} />
        <div className={`${isEditing ? 'items-start' : 'items-center'} flex gap-6 w-full`}>
          <label className="block text-lg font-semibold w-[100px]" htmlFor="introduction">
            자기소개
          </label>
          {!isEditing ? (
            <p className="block text-sm font-medium">{user.intro}</p>
          ) : (
            <textarea
              className="p-2 border border-gray-300 rounded-md w-1/2"
              id="introduction"
              placeholder="자기소개를 입력해주세요. 예)MBTI, 취미, 관심사 등"
              value={inputIntro.value}
              onChange={inputIntro.onChange}
              maxLength={15}
            />
          )}
        </div>
        <div className="flex justify-center gap-2">
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
        <button className="underline max-w-24 m-auto" onClick={() => handleDeleteUser(user!.user_id)}>
          회원탈퇴
        </button>
        <ValidationModal />
        <MetPeople />
        <MyPost />
      </div>
    </div>
  );
};

export default Profile;
