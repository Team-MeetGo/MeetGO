import { Database } from '(@/types/database.types)';
import { create } from 'zustand';
import { UsersType } from '(@/types/userTypes)';

type UserState = {
  user: UsersType[] | null;
  participants: UserDataFromTable[] | null | undefined;
  setUser: (data: UsersType[]) => void;
  setParticipants: (others: UserDataFromTable[]) => void;
};

export const userStore = create<UserState>()((set) => ({
  user: null,
  participants: null,
  setUser: (data) => set({ user: data }),
  setParticipants: (participants) => set({ participants })
}));
