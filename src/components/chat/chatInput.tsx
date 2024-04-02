'use client';
import { UserData } from '(@/types)';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Input } from '@nextui-org/react';
import { useState } from 'react';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';

const ChatInput = ({ userData }: { userData: UserData }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (userData) {
      const { error } = await clientSupabase.from('messages').insert({
        send_from: userData[0].user_id,
        message: message,
        nickname: userData[0].nickname,
        avatar: userData[0].avatar
      });
      if (error) {
        alert(error.message);
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
