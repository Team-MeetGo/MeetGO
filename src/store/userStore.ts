import { create } from 'zustand';
import { UsersType } from '(@/types/userTypes)';

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
  setUser: (data) => set({ user: data }),
  setParticipants: (participants) => set({ participants }),
  clearUser: () => set({ user: null }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn })
}));
