'use client';

import React from 'react';
import Map from '@/components/chat/sidebar/Map';
import { useChatDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { Card, CardBody } from '@nextui-org/react';
import { SideBarProps } from '@/types/sideBarTypes';
import { sideBarStore } from '@/store/sideBarStore';

const SideBar: React.FC<SideBarProps> = ({ chatRoomId }) => {
  const { isSidebarOpen } = sideBarStore((state) => state);

  //채팅방 정보 가져오기
  const chat = useChatDataQuery(chatRoomId);
  const meetingTime = chat?.[0]?.meeting_time;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Asia/Seoul'
  };
  const convertedTime = meetingTime ? new Intl.DateTimeFormat('ko-KR', options).format(new Date(meetingTime)) : '';

  return (
    <div className={`transition-transform duration-300 ease-in-out ml-auto ${isSidebarOpen ? 'ml-auto' : 'ml-0'}`}>
      <div
        style={{ maxHeight: '100vh', overflowY: 'auto' }}
        className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="pt-8 pr-6">
          <h1 className="font-semibold text-2xl mb-2">미팅 날짜/시간</h1>
          <Card className="h-[60px] border border-mainColor rounded-[9px] shadow-none ">
            <CardBody className="flex flex-row justify-start items-center text-lg">
              <p className={convertedTime ? '' : 'text-gray2'}>
                {convertedTime ? convertedTime : '방장이 선택한 시간이 표시됩니다.'}
              </p>
            </CardBody>
          </Card>
          <Map chatRoomId={chatRoomId} />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
