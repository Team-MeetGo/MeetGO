import { create } from 'zustand';

export interface RoomState {
  tags: string[];
  roomRegion: string | undefined;
  memberNumber: string | undefined;

  addTags: (by: string) => void;
  deleteTags: (by: string) => void;
  setTags: (by: string[]) => void;
  resetTags: () => void;

  setRoomRegion: (by: string) => void;
  resetRoomRegion: () => void;

  setMemberNumber: (by: string) => void;
  resetMemberNumber: () => void;
}

export const useRoomStore = create<RoomState>()((set) => ({
  tags: [],
  roomRegion: undefined,
  memberNumber: undefined,

  addTags: (tag: string) => set((state) => ({ tags: [...state.tags, tag] })),
  deleteTags: (removeTag: string) => set((state) => ({ tags: state.tags.filter((tag) => tag !== removeTag) })),
  setTags: (features: string[]) => set({ tags: features }),
  resetTags: () => set((state) => ({ tags: [] })),

  setRoomRegion: (m: string) => set({ roomRegion: m }),
  resetRoomRegion: () => set(() => ({ roomRegion: undefined })),

  setMemberNumber: (m: string) => set({ memberNumber: m }),
  resetMemberNumber: () => set(() => ({ memberNumber: undefined }))
}));
