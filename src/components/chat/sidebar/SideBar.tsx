'use client';

import Map from '@/components/chat/sidebar/Map';
import { useChatDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { Card, CardBody } from '@nextui-org/react';
import { sideBarStore } from '@/store/sideBarStore';
import { dateOptions } from '@/utils/utilFns';
import MobileMap from './MobileMap';
import { useEffect, useState } from 'react';

const SideBar = ({ chatRoomId }: { chatRoomId: string }) => {
  const { isSidebarOpen } = sideBarStore((state) => state);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  //채팅방 정보 가져오기
  const chat = useChatDataQuery(chatRoomId);
  const meetingTime = chat.meeting_time;
  const convertedTime = meetingTime ? new Intl.DateTimeFormat('ko-KR', dateOptions).format(new Date(meetingTime)) : '';

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="max-h-[calc(100vh-90px)] overflow-y-auto pt-8 px-4 ease-in-out duration-1000 w-full lg:w-96 sm:w-80">
      <h1 className="font-semibold text-2xl mb-2">미팅 날짜/시간</h1>
      <Card className="h-14 border border-mainColor rounded-lg shadow-none w-full">
        <CardBody className="flex flex-row justify-start items-center text-lg">
          <p className={convertedTime ? '' : 'text-gray2'}>
            {convertedTime ? convertedTime : '방장이 선택한 시간이 표시됩니다.'}
          </p>
        </CardBody>
      </Card>
      {isMobile ? <MobileMap chatRoomId={chatRoomId} /> : <Map chatRoomId={chatRoomId} />}
    </div>
  );
};

export default SideBar;
