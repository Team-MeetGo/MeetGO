import { RoomData } from '(@/types/chatTypes)';
import { create } from 'zustand';

type chatState = {
  roomData: RoomData[] | null;
  setRoomData: (data: RoomData[]) => void;
};

export const chatStore = create<chatState>()((set) => ({
  roomData: null,
  setRoomData: (data: RoomData[]) => set({ roomData: data })
}));
