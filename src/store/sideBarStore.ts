import { create } from 'zustand';

interface SidebarState {
  selectedMeetingLocation: string;
  selectedMeetingTime: string;
  finalDateTime: string;
  isTimeSelected: boolean;
  setSelectedMeetingTime: (dateTime: string) => void;
  setFinalDateTime: (dateTime: string) => void;
  setIsTimeSelected: (isTimeSelected: boolean) => void;
  setSelectedMeetingLocation: (selectedMeetingLocation: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  selectedMeetingLocation: '',
  selectedMeetingTime: '',
  finalDateTime: '',
  isTimeSelected: false,
  setSelectedMeetingTime: (dateTime) => set({ selectedMeetingTime: dateTime }),
  setFinalDateTime: (dateTime) => set({ finalDateTime: dateTime }),
  setIsTimeSelected: (isTimeSelected) => set({ isTimeSelected: isTimeSelected }),
  setSelectedMeetingLocation: (selectedMeetingLocation) => set({ selectedMeetingLocation: selectedMeetingLocation })
}));
