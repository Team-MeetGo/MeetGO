import { RoomData } from '(@/types/chatTypes)';
import { create } from 'zustand';

type chatState = {
  roomData: RoomData[] | null;
  roomId: string | null;
  chatRoomId: string | null;
  setRoomData: (data: RoomData[]) => void;
  setRoomId: (roomId: string) => void;
  setChatRoomId: (chatRoomId: string) => void;
};

export const chatStore = create<chatState>()((set) => ({
  roomData: null,
  roomId: null,
  chatRoomId: null,
  setRoomData: (data: RoomData[]) => set({ roomData: data }),
  setRoomId: (roomId) => set({ roomId }),
  setChatRoomId: (chatRoomId) => set({ chatRoomId })
}));
