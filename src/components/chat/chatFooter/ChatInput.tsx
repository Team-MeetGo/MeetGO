'use client';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';
import { chatStore } from '(@/store/chatStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Input } from '@nextui-org/react';
import { useState } from 'react';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { data: user } = useGetUserDataQuery();
  const chatRoomId = chatStore((state) => state.chatRoomId);

  const handleSubmit = async () => {
    if (user && chatRoomId) {
      const { error } = await clientSupabase.from('messages').insert({
        send_from: user.user_id,
        message: message,
        nickname: String(user.nickname),
        avatar: String(user.avatar),
        chatting_room_id: chatRoomId
      });
      if (error) {
        console.error(error.message);
        alert('새로운 메세지 추가 실패');
      }
    }
  };

  return (
    <form
      className="p-5 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        setMessage('');
      }}
    >
      <Input value={message} placeholder="send message" onChange={(e) => setMessage(e.target.value)} />

      <button>
        <FaRegArrowAltCircleUp className="h-8 w-8 my-auto" />
      </button>
    </form>
  );
};

export default ChatInput;
