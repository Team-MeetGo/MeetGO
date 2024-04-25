'use client';

import React from 'react';
import Map from '@/components/chat/sidebar/Map';
import { useChatDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { Card, CardBody } from '@nextui-org/react';
import { sideBarStore } from '@/store/sideBarStore';

import { dateOptions } from '@/utils';

const SideBar = ({ chatRoomId }: { chatRoomId: string }) => {
  const { isSidebarOpen } = sideBarStore((state) => state);

  //채팅방 정보 가져오기
  const chat = useChatDataQuery(chatRoomId);
  const meetingTime = chat.meeting_time;
  const convertedTime = meetingTime ? new Intl.DateTimeFormat('ko-KR', dateOptions).format(new Date(meetingTime)) : '';

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="max-h-[53rem] ease-in-out duration-1000 max-w-[32rem] ">
      <div className="max-h-[53rem] overflow-y-auto pt-8 pr-6 w-[24rem]">
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
  );
};

export default SideBar;
