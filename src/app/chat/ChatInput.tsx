'use client';
import { clientSupabase } from '(@/utils/supabase/client)';
import { Input } from '@nextui-org/react';
import React, { useState } from 'react';

const ChatInput = () => {
  const [inputMsg, setInputMsg] = useState('');
  const supabase = clientSupabase();
  const handleSubmit = () => {};

  return (
    <form
      className="p-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Input value={inputMsg} placeholder="send message" onChange={(e) => setInputMsg(e.target.value)} />
    </form>
  );
};

export default ChatInput;
