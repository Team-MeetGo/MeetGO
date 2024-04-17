import { Message } from '@/types/chatTypes';
import { create } from 'zustand';

type chatState = {
  chatRoomId: string | null;
  messages: Message[];
  hasMore: boolean;
  chatState: boolean;
  isRest: boolean;
  searchMode: boolean;
  imgSection: boolean;

  setChatRoomId: (chatRoomId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  setHasMore: (hasMore: boolean) => void;
  setChatState: (isActive: boolean) => void;
  setisRest: (isRest: boolean) => void;
  setSearchMode: () => void;
  setImgSection: () => void;
};

export const chatStore = create<chatState>()((set) => ({
  chatRoomId: null,
  messages: [],
  hasMore: false,
  chatState: true,
  isRest: true,
  searchMode: false,
  imgSection: false,

  setChatRoomId: (chatRoomId) => set({ chatRoomId }),
  setMessages: (messages) => set({ messages }),
  setHasMore: (hasMore) => set({ hasMore }),
  setChatState: (isActive) => set({ chatState: isActive }),
  setisRest: (isRest) => set({ isRest }),
  setSearchMode: () => set((state) => ({ searchMode: !state.searchMode })),
  setImgSection: () => set((state) => ({ imgSection: !state.imgSection }))
}));
