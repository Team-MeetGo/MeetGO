'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { Message } from '@/types/chatTypes';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

const ChatImg = ({ msg }: { msg: Message }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [slideCount, setSlideCount] = useState(0);

  const showBigImg = (urlIdx: number) => {
    if (urlIdx >= 0) {
      onOpen();
      setSlideCount(urlIdx);
    }
  };

  const UpSlideCount = (msgArr: string[] | null) => {
    if (msgArr && slideCount < msgArr.length) {
      setSlideCount((prev) => prev + 1);
    }
  };
  const downSlideCount = (msgArr: string[] | null) => {
    if (msgArr && slideCount > 0) {
      setSlideCount((prev) => prev - 1);
    }
  };

  return (
    <>
      {msg.imgs?.length && (
        <div
          className={`grid ${msg.imgs.length < 2 ? 'grid-cols-1' : 'grid-cols-2'} 
          ${msg.imgs.length > 2 ? 'chatImgRowsOverOne' : 'chatImgRowsNotOverOne'}`}
        >
          {msg.imgs.map((url) => (
            <div key={url} className="w-36 relative">
              <Image
                src={url}
                alt="채팅 이미지"
                fill={true}
                style={{ objectFit: 'contain', borderRadius: '3px', cursor: 'pointer' }}
                sizes="500px"
                priority={true}
                onClick={() => showBigImg(msg.imgs ? msg.imgs.indexOf(url) : -1)}
              />
              <Modal
                size={'sm'}
                isOpen={isOpen}
                onClose={() => {
                  onClose();
                  setSlideCount(0);
                }}
              >
                <ModalContent className="h-96">
                  {(onClose) => {
                    return (
                      <>
                        <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                        <ModalBody className="px-2">
                          <div className="z-10 w-full flex my-auto text-[#1F2937] ">
                            {msg.imgs && slideCount > 0 ? (
                              <button
                                className="w-10 h-10 mr-auto rounded-full transition-opacity hover:bg-opacity-40 hover:bg-white "
                                onClick={() => downSlideCount(msg.imgs)}
                              >
                                <IoIosArrowBack className="mx-auto" />
                              </button>
                            ) : null}

                            {msg.imgs && slideCount < msg.imgs?.length - 1 ? (
                              <button
                                className="w-10 h-10 rotate-180 ml-auto rounded-full transition-opacity hover:bg-opacity-40 hover:bg-white "
                                onClick={() => UpSlideCount(msg.imgs)}
                              >
                                <IoIosArrowBack className="mx-auto" />
                              </button>
                            ) : null}
                          </div>
                          <Image
                            src={String(msg.imgs && msg.imgs[slideCount])}
                            alt="채팅 이미지"
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
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ChatImg;
