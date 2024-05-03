'use client';

import { Button } from '@nextui-org/react';

const ChatError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <div className="w-screen max-w-[1280px] h-screen p-[24px] flex flex-col justify-center items-center gap-2">
      <h1 className="text-3xl font-semibold">불편을 드려 죄송합니다.</h1>
      <h2 className="text-xl">{error.message}</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
};

export default ChatError;
