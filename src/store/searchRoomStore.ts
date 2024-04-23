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
  selectRegion: '전국',
  selectMemberNumber: '전체',

  setSelectRegion: (m: string) => set({ selectRegion: m }),
  resetSelectRegion: () => set(() => ({ selectRegion: '전국' })),

  setSelectMemberNumber: (m: string) => set({ selectMemberNumber: m }),
  resetSelectMemberNumber: () => set(() => ({ selectMemberNumber: '전체' }))
}));
