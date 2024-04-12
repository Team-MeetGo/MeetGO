import { Message } from '(@/types/chatTypes)';
import { create } from 'zustand';

type chatState = {
  chatRoomId: string | null;
  messages: Message[];
  hasMore: boolean;
  chatState: boolean;
  isRest: boolean;
  searchMode: boolean;
  isScrolling: boolean;
  checkedLastMsg: boolean;
  setChatRoomId: (chatRoomId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  setHasMore: (hasMore: boolean) => void;
  setChatState: (isActive: boolean) => void;
  setisRest: (isRest: boolean) => void;
  setSearchMode: () => void;
  setCheckedLastMsg: (checkedLastMsg: boolean) => void;
  setIsScrolling: (isScrolling: boolean) => void;
};

export const chatStore = create<chatState>()((set) => ({
  chatRoomId: null,
  messages: [],
  hasMore: false,
  chatState: true,
  isRest: true,
  searchMode: false,
  isScrolling: false,
  checkedLastMsg: false,
  setChatRoomId: (chatRoomId) => set({ chatRoomId }),
  setMessages: (messages) => set({ messages }),
  setHasMore: (hasMore) => set({ hasMore }),
  setChatState: (isActive) => set({ chatState: isActive }),
  setisRest: (isRest) => set({ isRest }),
  setSearchMode: () => set((state) => ({ searchMode: !state.searchMode })),
  setCheckedLastMsg: (checkedLastMsg) => set({ checkedLastMsg }),
  setIsScrolling: (isScrolling) => set({ isScrolling })
}));
