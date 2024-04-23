import { create } from 'zustand';
import type { ModalActions, ModalState } from '@/types/modalTypes';

/** 모달 상태 관리를 담당하는 저장소 */
export const useModalStore = create<ModalState & ModalActions>((set) => ({
  isOpen: false,
  type: 'alert',
  name: '',
  text: '',
  openModal: ({ type, name, text, onFunc }) => set({ isOpen: true, type, name, text, onFunc }),
  closeModal: () => set({ isOpen: false })
}));
