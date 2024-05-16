'use client';

import { chatStore } from '@/store/chatStore';
import { Input } from '@nextui-org/react';
import { ChangeEvent, useRef, useState } from 'react';
import { FaPlus, FaRegArrowAltCircleUp } from 'react-icons/fa';
import Image from 'next/image';
import { MdCancel } from 'react-icons/md';
import { useGetUserDataQuery } from '@/query/useQueries/useUserQuery';
import { useAddNewMsg } from '@/query/useMutation/useChattingMutation';

// 낙관적 업데이트
// useTransition

const ChatInput = () => {
  const { data: user } = useGetUserDataQuery();
  const { chatRoomId, imgs, setImgs } = chatStore((state) => state);
  const [message, setMessage] = useState('');
  const imgRef = useRef(null);

  const { mutate: addNewMsg } = useAddNewMsg();

  const collectImgFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      const newImgs = fileList.filter((file) => !imgs.some((img) => img.name === file.name));
      if ([...imgs, ...newImgs].length >= 5) {
        alert('이미지 추가는 최대 4장까지 가능합니다.');
      } else {
        setImgs([...imgs, ...newImgs]);
      }
    }
  };

  const cancelImgFile = (name: string) => {
    setImgs(imgs.filter((img) => img.name !== name));
  };

  return (
    <>
      <div>
        <form
          className="p-5 flex gap-[10px]"
          onSubmit={(e) => {
            e.preventDefault();
            addNewMsg({ user, chatRoomId, message, imgs });
            setImgs([]);
            setMessage('');
          }}
        >
          <label className="flex items-center cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={imgRef}
              onChange={(e) => {
                collectImgFile(e);
              }}
            />
            <span className="w-6 h-6 flex items-center justify-center">
              <FaPlus className="text-[#71717A] pointer-events-none" />
            </span>
          </label>
          <Input
            value={message}
            classNames={{
              input: ['bg-[#F2EAFA]', 'focus:outline-none'],
              innerWrapper: "'bg-[#F2EAFA]",
              inputWrapper: ['bg-[#F2EAFA]', '!cursor-text']
            }}
            placeholder="send message"
            onChange={(e) => setMessage(e.target.value)}
            disabled={imgs.length > 0}
          />
          <button>
            <FaRegArrowAltCircleUp className="h-8 w-8 my-auto text-[#71717A]" />
          </button>
        </form>

        {imgs.length
          ? imgs.length < 5 && (
              <div className="h-[180px] w-full p-[8px] flex overflow-x-auto gap-[8px] relative ">
                {imgs.map((img) => (
                  <div key={img.name} className="relative w-[150px]">
                    <button
                      id="img"
                      className="absolute top-0 right-0 z-10 text-xl"
                      onClick={() => cancelImgFile(img.name)}
                    >
                      <MdCancel />
                    </button>
                    <Image
                      src={URL.createObjectURL(img)}
                      alt={`img-${img.name}`}
                      fill={true}
                      style={{ objectFit: 'contain', borderRadius: '3px' }}
                      sizes="500px"
                      priority={true}
                    />
                  </div>
                ))}
              </div>
            )
          : null}
      </div>
    </>
  );
};

export default ChatInput;
