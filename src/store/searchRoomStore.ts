import { create } from 'zustand';

export interface searchRoomStoreState {
  selectRegion: string | undefined;
  selectMemberNumber: string | undefined;

  setSelectRegion: (by: string) => void;
  resetSelectRegion: () => void;

  setSelectMemberNumber: (by: string) => void;
  resetSelectMemberNumber: () => void;
}

export const useSearchRoomStore = create<searchRoomStoreState>()((set) => ({
  selectRegion: '지역',
  selectMemberNumber: '인원',

  setSelectRegion: (m: string) => set({ selectRegion: m }),
  resetSelectRegion: () => set(() => ({ selectRegion: undefined })),

  setSelectMemberNumber: (m: string) => set({ selectMemberNumber: m }),
  resetSelectMemberNumber: () => set(() => ({ selectMemberNumber: undefined }))
}));
