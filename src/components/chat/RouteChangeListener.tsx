'use client';

import { chatStore } from '(@/store/chatStore)';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const RouteChangeListener = () => {
  const { messages, chatRoomId } = chatStore((state) => state);
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    if (messages && messages.length) {
      if (pathname.replace('/chat/', '') === chatRoomId) {
        const lastMsgID = localStorage.getItem(`${chatRoomId}`);
        console.log('lastMsgID =>', lastMsgID);
      }
      return () => {
        localStorage.setItem(`${chatRoomId}`, JSON.stringify(messages[messages.length - 1].message_id));
        console.log('이거는 실행되니');
      };
    }
  }, [pathname, chatRoomId, messages]);

  return null;
};

export default RouteChangeListener;
