import create from 'zustand';

interface SidebarState {
  selectedLocation: string;
  selectedDateTime: string;
  finalDateTime: string;
  isTimePicked: boolean;
  setSelectedDateTime: (dateTime: string) => void;
  setFinalDateTime: (dateTime: string) => void;
  setIsTimePicked: (isPicked: boolean) => void;
  setSelectedLocation: (selectedLocation: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  selectedLocation: '',
  selectedDateTime: '',
  finalDateTime: '',
  isTimePicked: false,
  setSelectedDateTime: (dateTime) => set({ selectedDateTime: dateTime }),
  setFinalDateTime: (dateTime) => set({ finalDateTime: dateTime }),
  setIsTimePicked: (isPicked) => set({ isTimePicked: isPicked }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation: selectedLocation })
}));
