import React, { Suspense } from 'react';
import ChatInput from '../../components/chat/ChatInput';
import ChatListParent from '(@/components/chat/ChatListParent)';

const ChatPage = () => {
  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md flex flex-col border-indigo-600">
        {/* 헤더영역 */}
        <div className="h-20 border-b border-indigo-600 flex p-3 justify-between">
          <div className="font-bold text-2xl">
            MeetGo
            <div className="text-base font-normal">누가 들어와 있는지 들어갈 부분</div>
          </div>
          <div>몇 명 참여중인지</div>
        </div>
        {/* 메세지영역 */}
        <Suspense fallback="응애 나 애기 폴백">
          <ChatListParent />
        </Suspense>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
