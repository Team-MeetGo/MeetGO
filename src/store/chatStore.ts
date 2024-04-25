import { Message } from '@/types/chatTypes';
import { create } from 'zustand';

type chatState = {
  chatRoomId: string | null;
  hasMore: boolean;
  chatState: boolean;
  isRest: boolean;
  searchMode: boolean;
  imgs: File[];
  onlineUsers: string[];

  setChatRoomId: (chatRoomId: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setChatState: (isActive: boolean) => void;
  setisRest: (isRest: boolean) => void;
  setSearchMode: () => void;
  setImgs: (imgs: File[]) => void;
  setOnlineUsers: (onlineUsers: string[]) => void;
};

export const chatStore = create<chatState>()((set) => ({
  chatRoomId: null,
  hasMore: false,
  chatState: true,
  isRest: true,
  searchMode: false,
  imgs: [],
  onlineUsers: [],

  setChatRoomId: (chatRoomId) => set({ chatRoomId }),
  setHasMore: (hasMore) => set({ hasMore }),
  setChatState: (isActive) => set({ chatState: isActive }),
  setisRest: (isRest) => set({ isRest }),
  setSearchMode: () => set((state) => ({ searchMode: !state.searchMode })),
  setImgs: (imgs) => set({ imgs }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers })
}));
