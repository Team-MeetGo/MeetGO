import { create } from 'zustand';
import type { FavoriteType, UsersType } from '@/types/userTypes';

type UserState = {
  user: UsersType | null;
  participants: UsersType[] | null | undefined;
  isLoggedIn: boolean;

  setUser: (data: UsersType | null) => void;
  setParticipants: (others: UsersType[]) => void;
  clearUser: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const userStore = create<UserState>()((set) => ({
  user: null,
  participants: null,
  isLoggedIn: false,
  setUser: (user) => set({ user }),
  setParticipants: (participants) => set({ participants }),
  clearUser: () => set({ user: null }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn })
}));

type ProfileState = {
  postCount: number | undefined;
  likedPostCount: number | undefined;
  metPeopleCount: number | undefined;
  meetingRoomCount: number | undefined;

  setPostCount: (count: number) => void;
  setLikedPostCount: (count: number) => void;
  setMetPeopleCount: (count: number) => void;
  setMeetingRoomCount: (count: number) => void;
};

export const profileCount = create<ProfileState>()((set) => ({
  postCount: 0,
  likedPostCount: 0,
  metPeopleCount: 0,
  meetingRoomCount: 0,
  setPostCount: (count) => set({ postCount: count }),
  setLikedPostCount: (count) => set({ likedPostCount: count }),
  setMetPeopleCount: (count) => set({ metPeopleCount: count }),
  setMeetingRoomCount: (count) => set({ meetingRoomCount: count })
}));

export const useFavoriteStore = create<FavoriteType>()((set) => ({
  selected: new Set([]),
  setSelected: (newSet: Set<string>) => set({ selected: newSet })
}));

export const useEditingStore = create<{ isEditing: boolean; setIsEditing: (isEditing: boolean) => void }>((set) => ({
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing })
}));

type ProfileOnchangeState = {
  avatarInputValue: string | null;
  nicknameInputValue: string;
  schoolEmailInputValue: string;
  schoolNameInputValue: string;
  introInputValue: string;
  genderInputValue: string;
  kakaoIdInputValue: string;
  favoriteInputValue: string[];
  setAvatarInputValue: (value: string | null) => void;
  setNicknameInputValue: (value: string) => void;
  setSchoolEmailInputValue: (value: string) => void;
  setSchoolNameInputValue: (value: string) => void;
  setIntroInputValue: (value: string) => void;
  setGenderInputValue: (value: string) => void;
  setKakaoIdInputValue: (value: string) => void;
  setFavoriteInputValue: (value: string[]) => void;
};

export const useProfileOnchangeStore = create<ProfileOnchangeState>((set) => ({
  avatarInputValue: null,
  nicknameInputValue: '',
  schoolEmailInputValue: '',
  schoolNameInputValue: '',
  introInputValue: '',
  genderInputValue: '',
  kakaoIdInputValue: '',
  favoriteInputValue: [],
  setAvatarInputValue: (value) => set({ avatarInputValue: value }),
  setNicknameInputValue: (value) => set({ nicknameInputValue: value }),
  setSchoolEmailInputValue: (value) => set({ schoolEmailInputValue: value }),
  setSchoolNameInputValue: (value) => set({ schoolNameInputValue: value }),
  setIntroInputValue: (value) => set({ introInputValue: value }),
  setGenderInputValue: (value) => set({ genderInputValue: value }),
  setKakaoIdInputValue: (value) => set({ kakaoIdInputValue: value }),
  setFavoriteInputValue: (value) => set({ favoriteInputValue: value })
}));
