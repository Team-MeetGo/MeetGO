import { Message } from '@/types/chatTypes';
import { create } from 'zustand';

type sideBarState = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

export const sideBarStore = create<sideBarState>()((set) => ({
  isSidebarOpen: true,
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen })
}));
