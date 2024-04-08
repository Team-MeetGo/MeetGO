import { Message, RoomData } from '(@/types/chatTypes)';
import { create } from 'zustand';

type sideBarState = {
  selectedMeetingTime: string | null;
  isTimeSelected: boolean;
  finalDateTime: string | null;
  setSelectedMeetingTime: (selectedMeetingTime: string | null) => void;
  setIsTimeSelected: (isTimeSelected: boolean) => void;
  setFinalDateTime: (finalDateTime: string | null) => void;
};

export const sideBarStore = create<sideBarState>()((set) => ({
  selectedMeetingTime: null,
  finalDateTime: null,
  isTimeSelected: false,
  setSelectedMeetingTime: (selectedMeetingTime) => set({ selectedMeetingTime }),
  setIsTimeSelected: (isTimeSelected) => set({ isTimeSelected }),
  setFinalDateTime: (finalDateTime) => set({ finalDateTime })
}));
