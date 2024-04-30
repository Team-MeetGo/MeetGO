'use client';
import { useProfileOnchangeStore } from '@/store/userStore';
import { UsersType } from '@/types/userTypes';
import { useEffect } from 'react';

export const useProfileSet = (user: any) => {
  const {
    setAvatarInputValue,
    setSchoolEmailInputValue,
    setSchoolNameInputValue,
    setIntroInputValue,
    setKakaoIdInputValue,
    setGenderInputValue,
    setFavoriteInputValue,
    setNicknameInputValue
  } = useProfileOnchangeStore();

  useEffect(() => {
    if (user) {
      if (user.nickname) {
        setNicknameInputValue(user.nickname);
      }
      if (user.avatar) {
        setAvatarInputValue(user.avatar);
      }
      if (user.intro) {
        setIntroInputValue(user.intro);
      }
      if (user.kakaoId) {
        setKakaoIdInputValue(user.kakaoId);
      }
      if (user.school_email) {
        setSchoolEmailInputValue(user.school_email);
      }
      if (user.school_name) {
        setSchoolNameInputValue(user.school_name);
      }
      if (user.gender) {
        setGenderInputValue(user.gender);
      }
      if (user.favorite) {
        setFavoriteInputValue(user.favorite);
      }
    }
  }, [user]);

  // 사용자 정보를 초기화하는 함수
  const resetProfile = () => {
    setNicknameInputValue(user?.nickname);
    setAvatarInputValue(user?.avatar);
    setIntroInputValue(user?.intro);
    setKakaoIdInputValue(user?.kakaoId);
    setSchoolEmailInputValue(user?.school_email);
    setSchoolNameInputValue(user?.school_name);
    setGenderInputValue(user?.gender);
    setFavoriteInputValue(user?.favorite);
  };

  // 리셋 함수 반환
  return resetProfile;
};
