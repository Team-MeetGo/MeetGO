import { UserDataFromTable } from '(@/types/userTypes)';
import { create } from 'zustand';

type UserState = {
  user: UserDataFromTable[] | null;
  setUser: (data: UserDataFromTable[]) => void;
};

export const userStore = create<UserState>()((set) => ({
  user: null,
  setUser: (data) => set({ user: data })
}));
