import { create } from 'zustand';

export const useCommentCountStore = create((set) => ({
  commentCount: 0,
  setCommentCount: (count: number) => set({ commentCount: count })
}));
