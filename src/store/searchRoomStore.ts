import { REGIONANDMEMBER } from '@/utils/constant';
import { create } from 'zustand';

export interface searchRoomStoreState {
  selectRegion: string;
  selectMemberNumber: string;

  setSelectRegion: (by: string) => void;
  resetSelectRegion: () => void;

  setSelectMemberNumber: (by: string) => void;
  resetSelectMemberNumber: () => void;
}

export const useSearchRoomStore = create<searchRoomStoreState>()((set) => ({
  selectRegion: REGIONANDMEMBER.EVERYWHERE,
  selectMemberNumber: REGIONANDMEMBER.EVERYMEMBER,

  setSelectRegion: (m: string) => set({ selectRegion: m }),
  resetSelectRegion: () => set(() => ({ selectRegion: REGIONANDMEMBER.EVERYWHERE })),

  setSelectMemberNumber: (m: string) => set({ selectMemberNumber: m }),
  resetSelectMemberNumber: () => set(() => ({ selectMemberNumber: REGIONANDMEMBER.EVERYMEMBER }))
}));
