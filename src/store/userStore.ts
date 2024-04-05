import { UserDataFromTable } from '(@/types/userTypes)';
import { create } from 'zustand';

type UserState = {
  user: UserDataFromTable[] | null;
  participants: UserDataFromTable[] | null | undefined;
  setUser: (data: UserDataFromTable[]) => void;
  setParticipants: (others: UserDataFromTable[]) => void;
};

export const userStore = create<UserState>()((set) => ({
  user: null,
  participants: null,
  setUser: (data) => set({ user: data }),
  setParticipants: (participants) => set({ participants })
}));
