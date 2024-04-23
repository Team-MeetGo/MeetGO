import { Message } from '@/types/chatTypes';
import { create } from 'zustand';

type chatState = {
  chatRoomId: string | null;
  messages: Message[];
  hasMore: boolean;
  chatState: boolean;
  isRest: boolean;
  searchMode: boolean;
  imgs: File[];
  onlineUsers: string[];

  setChatRoomId: (chatRoomId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  setHasMore: (hasMore: boolean) => void;
  setChatState: (isActive: boolean) => void;
  setisRest: (isRest: boolean) => void;
  setSearchMode: () => void;
  setImgs: (imgs: File[]) => void;
  setOnlineUsers: (onlineUsers: string[]) => void;
  // setSelectedMeetingTime: (value: React.SetStateAction<Date | null>) => void
};

export const chatStore = create<chatState>()((set) => ({
  chatRoomId: null,
  messages: [],
  hasMore: false,
  chatState: true,
  isRest: true,
  searchMode: false,
  imgs: [],
  onlineUsers: [],

  setChatRoomId: (chatRoomId) => set({ chatRoomId }),
  setMessages: (messages) => set({ messages }),
  setHasMore: (hasMore) => set({ hasMore }),
  setChatState: (isActive) => set({ chatState: isActive }),
  setisRest: (isRest) => set({ isRest }),
  setSearchMode: () => set((state) => ({ searchMode: !state.searchMode })),
  setImgs: (imgs) => set({ imgs }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers })
  // setSelectedMeetingTime:
}));
