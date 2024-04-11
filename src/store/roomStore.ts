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
  roomRegion: undefined,
  memberNumber: undefined,

  setRoomRegion: (m: string) => set({ roomRegion: m }),
  resetRoomRegion: () => set(() => ({ roomRegion: undefined })),

  setMemberNumber: (m: string) => set({ memberNumber: m }),
  resetMemberNumber: () => set(() => ({ memberNumber: undefined }))
}));
