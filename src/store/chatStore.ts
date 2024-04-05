import { Message, RoomData } from '(@/types/chatTypes)';
import { create } from 'zustand';

type chatState = {
  roomData: RoomData[] | null;
  roomId: string | null;
  chatRoomId: string | null;
  messages: Message[];
  hasMore: boolean;
  setRoomData: (data: RoomData[]) => void;
  setRoomId: (roomId: string | null) => void;
  setChatRoomId: (chatRoomId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  setHasMore: (hasMore: boolean) => void;
};

export const chatStore = create<chatState>()((set) => ({
  roomData: null,
  roomId: null,
  chatRoomId: null,
  messages: [],
  hasMore: false,

  setRoomData: (data: RoomData[]) => set({ roomData: data }),
  setRoomId: (roomId) => set({ roomId }),
  setChatRoomId: (chatRoomId) => set({ chatRoomId }),
  setMessages: (messages) => set({ messages }),
  setHasMore: (hasMore) => set({ hasMore })
}));
