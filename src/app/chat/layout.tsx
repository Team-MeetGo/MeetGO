'use client';

import RouteChangeListener from '(@/components/chat/RouteChangeListener)';
import { PropsWithChildren } from 'react';

const ChatLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* <RouteChangeListener /> */}
      <div>{children}</div>
    </>
  );
};

export default ChatLayout;
