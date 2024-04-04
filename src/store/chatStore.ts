import { Message, RoomData } from '(@/types/chatTypes)';
import { create } from 'zustand';

type chatState = {
  roomData: RoomData[] | null;
  roomId: string | null;
  chatRoomId: string | null;
  messages: Message[];
  setRoomData: (data: RoomData[]) => void;
  setRoomId: (roomId: string) => void;
  setChatRoomId: (chatRoomId: string | null) => void;
  setMessages: (messages: Message[]) => void;
};

export const chatStore = create<chatState>()((set) => ({
  roomData: null,
  roomId: null,
  chatRoomId: null,
  messages: [],
  setRoomData: (data: RoomData[]) => set({ roomData: data }),
  setRoomId: (roomId) => set({ roomId }),
  setChatRoomId: (chatRoomId) => set({ chatRoomId }),
  setMessages: (messages) => set({ messages })
}));
