import React from 'react';
import ChatInput from './ChatInput';

const ChatPage = () => {
  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      {/* 위에 헤더영역 */}
      <div className="h-full border rounded-md flex flex-col border-indigo-600 ">
        <div className="h-20 border-b border-indigo-600 flex p-3 justify-between">
          <div className="font-bold text-2xl">
            MeetGo
            <div className="text-base font-normal">누가 들어와 있는지 들어갈 부분</div>
          </div>
          <div>몇 명 참여중인지</div>
        </div>
        {/* 메세지 영역 */}
        <div className="flex-1 bg-slate-500 p-5 flex flex-col gap-4 overflow-y-auto h-full">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
            return (
              <div className="flex gap-4" key={num}>
                <div className="h-14 w-14 bg-indigo-600 rounded-full my-auto">avatar</div>

                <div className="w-80 h-24 flex flex-col gap-1">
                  <div className="font-bold">userName</div>
                  <div className="border rounded-md p-3 h-full">message</div>
                </div>

                <div className="mt-auto text-slate-100 text-sm">
                  <p>{new Date().toDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>

        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
