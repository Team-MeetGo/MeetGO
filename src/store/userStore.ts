import { create } from 'zustand';
import { UsersType } from '(@/types/userTypes)';

type UserState = {
  user: UsersType[] | null;
  participants: UsersType[] | null | undefined;
  setUser: (data: UsersType[]) => void;
  setParticipants: (others: UsersType[]) => void;
};

export const userStore = create<UserState>()((set) => ({
  user: null,
  participants: null,
  setUser: (data) => set({ user: data }),
  setParticipants: (participants) => set({ participants })
}));
