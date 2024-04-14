'use client';

import React, { useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import { useChatDataQuery, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Card, CardBody } from '@nextui-org/react';
import { useGetUserDataQuery } from '(@/hooks/useQueries/useUserQuery)';

interface SideBarProps {
  chatRoomId: string;
}

const SideBar: React.FC<SideBarProps> = ({ chatRoomId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // 유저 정보 가져오기
  const { data: userData } = useGetUserDataQuery();
  const userId = userData?.user_id;

  const room = useRoomDataQuery(chatRoomId);
  const leaderId = room?.roomData.leader_id;

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=" w-[377px] flex justify-start ml-auto flex-col z-0 transition-all duration-300 ease-in-out">
      <div className={`flex ${isSidebarOpen ? 'justify-end' : 'justify-end'}`}>
        <GiHamburgerMenu onClick={toggleSidebar} />
      </div>
      <div style={{ maxHeight: '100vh', overflowY: 'auto', paddingRight: '24px' }}>
        {isSidebarOpen && (
          <div className="pt-8">
            <h1 className="font-semibold text-2xl mb-2">미팅 날짜/시간</h1>
            <Card className="h-[60px] border border-mainColor rounded-[9px] shadow-none h-[60px]">
              <CardBody className="flex flex-row justify-start items-center text-lg">
                <p>{convertedTime}</p>
              </CardBody>
            </Card>
            <Map chatRoomId={chatRoomId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
