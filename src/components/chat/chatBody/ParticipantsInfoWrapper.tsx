import { Message } from '@/types/chatTypes';
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

const ParticipantsInfoWrapper = ({
  showThatUser,
  msg,
  leaderId
}: {
  showThatUser: any;
  msg: Message;
  leaderId: string | undefined;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showMember = () => {
    onOpen();
  };

  return (
    <>
      <div className="relative flex h-16 w-16 ">
        <div className="h-16 w-16 ml-auto flex justify-center items-center">
          {showThatUser(msg.send_from)?.avatar ? (
            <Avatar
              src={showThatUser(msg.send_from)?.avatar as string}
              alt="Avatar"
              className="transition-transform w-14 h-14"
              onClick={showMember}
            />
          ) : (
            <AvatarDefault />
          )}
        </div>

        {leaderId && leaderId === showThatUser(msg.send_from)?.user_id ? (
          <div className="w-6 h-6 rounded-full absolute bottom-0 right-0 flex justify-center bg-purpleThird border border-gray1 font-extralight">
            <FaCrown className="my-auto fill-mainColor" />
          </div>
        ) : null}
      </div>
      <Modal size={'sm'} isOpen={isOpen} onClose={onClose} className="z-30">
        <ModalContent className="h-96">
          {(onClose) => {
            return (
              <>
                <ModalHeader className="flex flex-col gap-1 z-40 pointer-events-none">
                  {showThatUser(msg.send_from)?.nickname}
                </ModalHeader>
                <ModalBody>
                  <Image
                    src={showThatUser(msg.send_from)?.avatar as string}
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

export default ParticipantsInfoWrapper;
