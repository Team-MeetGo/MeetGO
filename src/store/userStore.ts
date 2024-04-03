import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

type UserStoreType = {
  login_email: string;
  nickname: string;
  avatar: string;
  school_email: string;
  gender: string;
  school_name: string;
  kakaoId: string;
  intro: string;
  favorite: string[];
  isValidate: boolean;
  setLoginEmail: (newLoginEmail: string) => void;
  setNickname: (newNickname: string) => void;
  setAvatar: (newAvatar: string) => void;
  setSchoolEmail: (newSchoolEmail: string) => void;
  setGender: (newGender: string) => void;
  setSchoolName: (newSchoolName: string) => void;
  setKakaoId: (newKakaoId: string) => void;
  setIntro: (newIntro: string) => void;
  setFavorite: (newFavorite: string[]) => void;
  setIsValidate: (newIsValidate: boolean) => void;
};

export const useUserStore = create<UserStoreType>((set) => ({
  login_email: '',
  nickname: '',
  avatar: '',
  school_email: '',
  gender: '',
  school_name: '',
  kakaoId: '',
  intro: '',
  favorite: [],
  isValidate: false,
  setLoginEmail: (newLoginEmail) => set({ login_email: newLoginEmail }),
  setNickname: (newNickname) => set({ nickname: newNickname }),
  setAvatar: (newAvatar) => set({ avatar: newAvatar }),
  setSchoolEmail: (newSchoolEmail) => set({ school_email: newSchoolEmail }),
  setGender: (newGender) => set({ gender: newGender }),
  setSchoolName: (newSchoolName) => set({ school_name: newSchoolName }),
  setKakaoId: (newKakaoId) => set({ kakaoId: newKakaoId }),
  setIntro: (newIntro) => set({ intro: newIntro }),
  setFavorite: (newFavorite) => set({ favorite: newFavorite }),
  setIsValidate: (newIsValidate) => set({ isValidate: newIsValidate })
}));
