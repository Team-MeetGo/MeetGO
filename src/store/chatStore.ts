import { Message, RoomData } from '(@/types/chatTypes)';
import { create } from 'zustand';

type chatState = {
  // roomData: RoomData[] | null;
  // roomId: string | null;
  chatRoomId: string | null;
  messages: Message[];
  hasMore: boolean;
  chatState: boolean;
  isRest: boolean;
  searchMode: boolean;
  // setRoomData: (data: RoomData[]) => void;
  // setRoomId: (roomId: string | null) => void;
  setChatRoomId: (chatRoomId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  setHasMore: (hasMore: boolean) => void;
  setChatState: (isActive: boolean) => void;
  setisRest: (isRest: boolean) => void;
  setSearchMode: () => void;
};

export const chatStore = create<chatState>()((set) => ({
  // roomData: null,
  // roomId: null,
  chatRoomId: null,
  messages: [],
  hasMore: false,
  chatState: true,
  isRest: true,
  searchMode: false,
  // setRoomData: (data: RoomData[]) => set({ roomData: data }),
  // setRoomId: (roomId) => set({ roomId }),
  setChatRoomId: (chatRoomId) => set({ chatRoomId }),
  setMessages: (messages) => set({ messages }),
  setHasMore: (hasMore) => set({ hasMore }),
  setChatState: (isActive) => set({ chatState: isActive }),
  setisRest: (isRest) => set({ isRest }),
  setSearchMode: () => set((state) => ({ searchMode: !state.searchMode }))
}));
