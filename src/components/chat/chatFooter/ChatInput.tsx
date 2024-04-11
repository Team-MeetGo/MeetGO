'use client';
import { chatStore } from '(@/store/chatStore)';
import { userStore } from '(@/store/userStore)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Input } from '@nextui-org/react';
import { useState } from 'react';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const userData = userStore((state) => state.user);
  const chatRoomId = chatStore((state) => state.chatRoomId);

  const handleSubmit = async () => {
    if (userData && chatRoomId) {
      const { error } = await clientSupabase.from('messages').insert({
        send_from: userData[0].user_id,
        message: message,
        nickname: String(userData[0].nickname),
        avatar: String(userData[0].avatar),
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