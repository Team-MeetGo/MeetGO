'use client';
import { UserTypeFromTable } from '@/types/userTypes';
import AvatarDefault from '@/utils/icons/AvatarDefault';
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react';
import Image from 'next/image';
import { FaCrown } from 'react-icons/fa6';

const MyInfoWrapper = ({
  user,
  leaderId
}: {
  user: UserTypeFromTable | null | undefined;
  leaderId: string | undefined;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showMember = () => {
    onOpen();
  };
  return (
    <>
      <div className="flex h-[60px] w-[60px] ">
        <div className="h-16 w-16 ml-auto flex justify-center items-center">
          {user?.avatar ? (
            <Avatar
              src={user.avatar as string}
              alt="Avatar"
              size="lg"
              className="transition-transform object-cover cursor-pointer"
              onClick={showMember}
            />
          ) : (
            <AvatarDefault />
          )}
        </div>
        {leaderId === user?.user_id ? (
          <div className="w-6 h-6 rounded-full absolute bottom-0 left-0 flex justify-center bg-purpleThird border border-gray1">
            <FaCrown className="my-auto fill-mainColor" />
          </div>
        ) : null}
      </div>
      <Modal size={'sm'} isOpen={isOpen} onClose={onClose} className="z-30">
        <ModalContent className="h-96">
          {(onClose) => {
            return (
              <>
                <ModalHeader className="flex flex-col gap-1 z-40 pointer-events-none">{user?.nickname}</ModalHeader>
                <ModalBody>
                  <Image
                    src={user?.avatar as string}
                    alt="유저 이미지"
                    fill={true}
                    style={{ objectFit: 'contain', borderRadius: '3px', pointerEvents: 'none' }}
                    sizes="500px"
                    priority={true}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};
export default MyInfoWrapper;
