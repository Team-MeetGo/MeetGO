'use client';
import { Button } from '@nextui-org/react';

const LoadChatMore = ({ fetchMoreMsg }: { fetchMoreMsg: () => Promise<void> }) => {
  return (
    <div>
      <Button className="w-full" onClick={fetchMoreMsg}>
        더보기
      </Button>
    </div>
  );
};

export default LoadChatMore;
