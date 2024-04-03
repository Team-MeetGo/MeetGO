import { Database } from '(@/types/database.types)';
import { create } from 'zustand';
import { UsersType } from '(@/types/userTypes)';

type UserState = {
  user: UsersType[] | null;
  setUser: (data: UsersType[]) => void;
};

export const userStore = create<UserState>()((set) => ({
  user: null,
  setUser: (data) => set({ user: data })
}));
