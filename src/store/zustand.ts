import { create } from 'zustand';

export interface TagState {
  tags: string[];
  addTags: (by: string) => void;
  deleteTags: (by: string) => void;
  resetTags: () => void;
}

export const useTagStore = create<TagState>()((set) => ({
  tags: [],
  addTags: (tag: string) => set((state) => ({ tags: [...state.tags, tag] })),
  deleteTags: (removeTag: string) => set((state) => ({ tags: state.tags.filter((tag) => tag !== removeTag) })),
  resetTags: () => set((state) => ({ tags: [] }))
}));
