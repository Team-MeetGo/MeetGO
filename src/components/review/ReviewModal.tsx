import React from 'react';
import { Modal } from '@nextui-org/react';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const ReviewModal = ({ children, isOpen, onClose }: Props) => {
  const handleClose = () => {
    if (window.confirm('리뷰 등록을 취소하시겠습니까?')) {
      onClose();
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={isOpen ? handleClose : undefined}>
        <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-neutral-900/70 z-50">
          <div>{children}</div>
        </div>
      </Modal>
    </>
  );
};

export default ReviewModal;
