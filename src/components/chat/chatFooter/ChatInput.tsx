'use client';
import { useGetUserDataQuery } from '@/hooks/useQueries/useUserQuery';
import { chatStore } from '@/store/chatStore';
import { clientSupabase } from '@/utils/supabase/client';
import { Input } from '@nextui-org/react';
import { ChangeEvent, useRef, useState } from 'react';
import { FaPlus, FaRegArrowAltCircleUp } from 'react-icons/fa';

//이거 나중에 지우자
const ChatInput = () => {
  const { data: user } = useGetUserDataQuery();
  const chatRoomId = chatStore((state) => state.chatRoomId);
  const [message, setMessage] = useState('');
  const [imgs, setImgs] = useState<File[]>([]);
  const imgRef = useRef(null);

  const handleSubmit = async () => {
    if (user && chatRoomId && message.length) {
      const { error } = await clientSupabase.from('messages').insert({
        send_from: user.user_id,
        message: message,
        chatting_room_id: chatRoomId
      });
      if (error) {
        console.error(error.message);
        alert('새로운 메세지 추가 실패');
      }
    }
  };

  const handleImgFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      setImgs([...fileList]);
    }
  };

  const handleClick = () => {};

  return (
    <div>
      <form
        className="p-5 flex gap-[10px]"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
          setMessage('');
        }}
      >
        <label className="flex items-center cursor-pointer">
          <input type="file" multiple accept="image/*" className="hidden" ref={imgRef} onChange={handleImgFile} />
          <span className="w-6 h-6 flex items-center justify-center">
            <FaPlus className="text-[#71717A] pointer-events-none" />
          </span>
        </label>
        <Input
          value={message}
          classNames={{ input: ['bg-[#F2EAFA]', 'focus:outline-none'] }}
          placeholder="send message"
          onChange={(e) => setMessage(e.target.value)}
        />

        <button>
          <FaRegArrowAltCircleUp className="h-8 w-8 my-auto text-[#71717A]" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
