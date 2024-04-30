'use client';
import useInputChange from '@/hooks/custom/useInputChange';
import { useProfileUpdateMutation } from '@/hooks/useMutation/useProfileMutation';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { useModalStore } from '@/store/modalStore';
import { useEditingStore, useFavoriteStore, useProfileOnchangeStore } from '@/store/userStore';
import { UpdateProfileType } from '@/types/userTypes';
import { deleteUser } from '@/utils/api/authAPI';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import AvatarForm from './AvatarForm';
import UserNickname from './UserNickname';
import { useProfileSet } from '@/hooks/custom/useProfileSet';
import UserLoginEmail from './UserLoginEmail';
import UserGender from './UserGender';
import UserSchoolForm from './UserSchoolForm';
import UserKakaoId from './UserKakaoId';
import UserFavorite from './UserFavorite';
import UserIntro from './UserIntro';
const ProfileSetting = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUserDataQuery();
  const resetProfile = useProfileSet(user);
  const { isEditing, setIsEditing } = useEditingStore();
  const { openModal, closeModal } = useModalStore();
  const [validationMessages, setValidationMessages] = useState({
    schoolEmail: '',
    univName: ''
  });

  const {
    nicknameInputValue,
    avatarInputValue,
    schoolEmailInputValue,
    schoolNameInputValue,
    introInputValue,
    kakaoIdInputValue,
    genderInputValue,
    favoriteInputValue,
    setFavoriteInputValue
  } = useProfileOnchangeStore();

  const { mutate: updateProfileMutate } = useProfileUpdateMutation();

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onCancelHandle = () => {
    setIsEditing(false);
    resetProfile();
  };

  /** 수정하고 저장버튼 클릭시 실행될 로직(상태 업데이트 및 갱신) */
  const handleProfileUpdate = ({ userId, inputNickname, inputIntro, inputKakaoId, inputGender }: UpdateProfileType) => {
    updateProfileMutate({
      userId,
      inputNickname,
      inputIntro,
      inputKakaoId,
      inputGender,
      favorite: Array.from(favoriteInputValue)
    });
    setIsEditing(false);
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
    <main className="flex flex-col gap-12">
      <div>
        <p className="font-semibold">회원정보</p>
        <p className="text-sm text-[#4B5563] mb-6">필수 회원정보를 모두 설정해주세요.</p>
        <div className="flex flex-col gap-6 items-start">
          <AvatarForm />
          <UserNickname />
          <UserLoginEmail />
          <UserGender />
          <UserSchoolForm />
          <UserKakaoId />
        </div>
      </div>
      <div className="max-w-[470px] w-full h-[1px] bg-[#E5E7EB]"></div>
      <div>
        <p className="font-semibold">추가정보</p>
        <p className="text-sm text-[#4B5563] mb-6">추가정보를 입력해주세요.</p>
        <div className="flex flex-col gap-6 items-start">
          <UserFavorite />
          <UserIntro />
        </div>
        <button
          className="underline max-w-24 mt-[48px] text-[#9CA3AF] text-sm font-light"
          onClick={() => handleDeleteUser(user?.user_id ?? '')}
        >
          회원탈퇴하기
        </button>
      </div>
      <div className="flex justify-center gap-2">
        {isEditing ? (
          <>
            <button
              className="border rounded-xl px-[32px] py-[12px] text-[18px] font-medium"
              onClick={() =>
                handleProfileUpdate({
                  userId: user?.user_id ?? '',
                  inputNickname: nicknameInputValue,
                  inputIntro: introInputValue,
                  inputKakaoId: kakaoIdInputValue,
                  inputGender: genderInputValue,
                  favorite: Array.from(favoriteInputValue)
                })
              }
            >
              저장하기
            </button>
            <button
              className="border rounded-xl px-[32px] py-[12px] text-[18px] font-medium bg-gray4"
              onClick={onCancelHandle}
            >
              취소
            </button>
          </>
        ) : (
          <button
            className="bg-mainColor rounded-xl px-[32px] py-[12px] text-[18px] text-white font-medium"
            onClick={toggleEditing}
          >
            수정하기
          </button>
        )}
      </div>
    </main>
  );
};

export default ProfileSetting;
