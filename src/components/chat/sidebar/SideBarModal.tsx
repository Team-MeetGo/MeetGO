'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { sideBarStore } from '@/store/sideBarStore';
import SideBar from './SideBar';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const SideBarModal = ({ chatRoomId }: { chatRoomId: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isSidebarOpen, setIsSidebarOpen } = sideBarStore((state) => state);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const openModal = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsSidebarVisible(!isSidebarOpen);
    onOpen(); // 모달 열기
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={openModal}
        className="absolute z-10 h-20 cursor-pointer shadow-xl flex justify-center items-center rounded-r-lg"
      >
        {isSidebarOpen ? <IoIosArrowForward size={28} color="#A1A1AA" /> : <IoIosArrowBack size={28} color="#A1A1AA" />}
      </button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">모달 타이틀</ModalHeader>
              <ModalBody>
                <div>
                  <SideBar chatRoomId={chatRoomId} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SideBarModal;
