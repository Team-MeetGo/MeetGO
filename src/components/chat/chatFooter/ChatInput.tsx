'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { chatStore } from '@/store/chatStore';
import { clientSupabase } from '@/utils/supabase/client';
import { Input } from '@nextui-org/react';
import { ChangeEvent, useRef, useState } from 'react';
import { FaPlus, FaRegArrowAltCircleUp } from 'react-icons/fa';
import Image from 'next/image';
import { MdCancel } from 'react-icons/md';

const ChatInput = () => {
  const { data: user } = useGetUserDataQuery();
  const { chatRoomId, imgSection, setImgSection } = chatStore((state) => state);
  const [message, setMessage] = useState('');
  const [imgs, setImgs] = useState<File[]>([]);
  const imgRef = useRef(null);
  console.log(imgSection);
  console.log('imgs =>', imgs);
  console.log(imgs.length);

  const handleSubmit = async () => {
    if (user && chatRoomId && (message.length || imgs.length)) {
      const { error } = await clientSupabase.from('messages').insert({
        send_from: user?.user_id,
        message: message.length ? message : null,
        chatting_room_id: chatRoomId,
        imgs: imgs.length ? imgs.map((img) => img.name) : []
      });
      if (error) {
        console.error(error.message);
        alert('새로운 메세지 추가 실패');
      }
    }
  };

  const collectImgFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      const newImgs = fileList.filter((file) => !imgs.some((img) => img.name === file.name));
      if ([...imgs, ...newImgs].length >= 5) {
        alert('이미지 추가는 최대 4장까지 가능합니다.');
      } else {
        setImgs([...imgs, ...newImgs]);
        console.log(URL.createObjectURL(files[0]));
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
            handleSubmit();
            setMessage('');
          }}
        >
          <label className="flex items-center cursor-pointer" onClick={() => setImgSection()}>
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
            classNames={{ input: ['bg-[#F2EAFA]', 'focus:outline-none'] }}
            placeholder="send message"
            onChange={(e) => setMessage(e.target.value)}
            disabled={imgs.length > 0}
          />

          <button>
            <FaRegArrowAltCircleUp className="h-8 w-8 my-auto text-[#71717A]" />
          </button>
        </form>
        {/* 가로축으로 스크롤 되게 하고 싶다.. */}
        {imgs.length
          ? imgs.length < 5 && (
              <div className="h-[180px] w-full p-[8px] flex overflow-x-auto gap-[8px] relative ">
                {imgs.map((img) => (
                  <div key={img.name} className="relative w-[150px]">
                    <button className="absolute top-0 right-0 z-10" onClick={() => cancelImgFile(img.name)}>
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
