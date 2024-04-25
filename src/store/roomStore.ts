import { REGIONANDMEMBER } from '@/utils/constant';
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
  roomRegion: REGIONANDMEMBER.EVERYWHERE,
  memberNumber: REGIONANDMEMBER.EVERYMEMBER,

  setRoomRegion: (m: string) => set({ roomRegion: m }),
  resetRoomRegion: () => set(() => ({ roomRegion: REGIONANDMEMBER.EVERYWHERE })),

  setMemberNumber: (m: string) => set({ memberNumber: m }),
  resetMemberNumber: () => set(() => ({ memberNumber: REGIONANDMEMBER.EVERYMEMBER }))
}));
