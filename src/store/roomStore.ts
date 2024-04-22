import { create } from 'zustand';

export interface RoomState {
  roomRegion: string | undefined;
  memberNumber: string | undefined;

  setRoomRegion: (by: string) => void;
  resetRoomRegion: () => void;

  setMemberNumber: (by: string) => void;
  resetMemberNumber: () => void;
}

export const useRoomStore = create<RoomState>()((set) => ({
  roomRegion: '전국',
  memberNumber: '2:2',

  setRoomRegion: (m: string) => set({ roomRegion: m }),
  resetRoomRegion: () => set(() => ({ roomRegion: '전국' })),

  setMemberNumber: (m: string) => set({ memberNumber: m }),
  resetMemberNumber: () => set(() => ({ memberNumber: '2:2' }))
}));
