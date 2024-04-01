import { Input } from '@nextui-org/react';
import React from 'react';

const ChatPage = () => {
  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md flex flex-col border-indigo-600 ">
        <div className="h-20 border-b border-indigo-600 flex p-3 justify-between">
          <div className="font-bold text-2xl">
            MeetGo
            <div className="text-base font-normal">누가 들어와 있는지 들어갈 부분</div>
          </div>
          <div>몇 명</div>
        </div>
        <div className="flex-1 bg-slate-500"></div>
        <div className="p-5">
          <Input />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
