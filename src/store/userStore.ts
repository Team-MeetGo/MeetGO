import { create } from 'zustand';
import { FavoriteType, UsersType } from '@/types/userTypes';

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
