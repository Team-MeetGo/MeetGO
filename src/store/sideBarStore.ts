import { create } from 'zustand';

type sideBarState = {
  isSidebarOpen: boolean;
  // selectedMeetingLocation: string;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  // setSelectedMeetingLocation: (barname: string) => void;
};

export const sideBarStore = create<sideBarState>()((set) => ({
  isSidebarOpen: true,
  // selectedMeetingLocation: '',
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen })
  // setSelectedMeetingLocation: (barname: string) => set({ selectedMeetingLocation: barname })
}));
