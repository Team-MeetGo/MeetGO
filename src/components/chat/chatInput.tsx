'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Input } from '@nextui-org/react';
import { useState } from 'react';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const { error } = await clientSupabase.from('messages').insert({ message });
    if (error) {
      alert(error.message);
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
