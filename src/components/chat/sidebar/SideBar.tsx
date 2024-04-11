'use client';

import React, { useEffect, useState } from 'react';
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
  const [finalDateTime, setFinalDateTime] = useState<string>();

  const room = useRoomDataQuery(chatRoomId);
  const leaderId = room?.roomData.leader_id;

  // 채팅방 정보 가져오기
  const chat = useChatDataQuery(chatRoomId);
  const meetingTime = chat?.[0]?.meeting_time;

  // 유저 정보 가져오기
  const { data: userData } = useGetUserDataQuery();
  const userId = userData?.user_id;

  console.log('test', meetingTime);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Asia/Seoul'
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=" w-[377px] flex flex-col ml-8 z-0 transition-all duration-300 ease-in-out">
      <div className={`flex ${isSidebarOpen ? 'justify-end' : 'justify-end'}`}>
        <GiHamburgerMenu onClick={toggleSidebar} />
      </div>
      <div style={{ maxHeight: '100vh', overflowY: 'auto', paddingRight: '24px' }}>
        {isSidebarOpen && (
          <div>
            <h1 className="font-semibold text-2xl mb-2.5">미팅 날짜/시간</h1>
            <Card className="border border-mainColor shadow-none mb-6 h-[60px]">
              <CardBody>
                <p className=" justify-start items-center text-lg">{finalDateTime}</p>
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
