export type ModalType = 'alert' | 'confirm';

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  name: string;
  text: string;
  onFunc?: () => void;
}

export interface ModalActions {
  openModal: (modalConfig: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
}
