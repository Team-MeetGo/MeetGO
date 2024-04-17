'use client';

import React, { useState } from 'react';
import Map from '@/components/chat/sidebar/Map';
import { useChatDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { Card, CardBody } from '@nextui-org/react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { SideBarProps } from '@/types/sideBarTypes';

const SideBar: React.FC<SideBarProps> = ({ chatRoomId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
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
    <div
      className={`sidebar-container ${
        isSidebarOpen ? 'open' : 'closed'
      } transition-transform duration-300 ease-in-out ml-auto`}
    >
      <div className="flex felx-row">
        <div
          style={{ maxHeight: '100vh', overflowY: 'auto' }}
          className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-all duration-1000 ease-in-out`}
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
        <div className=" h-20 flex items-center justify-center cursor-pointer shadow-xl" onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <IoIosArrowBack size={25} color="#A1A1AA" />
          ) : (
            <IoIosArrowForward size={25} color="#A1A1AA" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
