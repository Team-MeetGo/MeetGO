'use client';

import React, { useEffect } from 'react';
import Map from '@/components/chat/sidebar/Map';
import { useChatDataQuery } from '@/hooks/useQueries/useChattingQuery';
import { Card, CardBody } from '@nextui-org/react';
import { SideBarProps } from '@/types/sideBarTypes';
import { sideBarStore } from '@/store/sideBarStore';
import { clientSupabase } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { CHATDATA_QUERY_KEY } from '@/query/chat/chatQueryKeys';
import { useUpdateMeetingTimeMutation } from '@/hooks/useMutation/useMeetingTimeMutation';

const SideBar: React.FC<SideBarProps> = ({ chatRoomId }) => {
  const { isSidebarOpen } = sideBarStore((state) => state);
  const queryClient = useQueryClient();

  //채팅방 정보 가져오기
  const chat = useChatDataQuery(chatRoomId);
  const meetingTime = chat?.[0]?.meeting_time;
  const { mutate: updateMeetingTime } = useUpdateMeetingTimeMutation();

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

  useEffect(() => {
    if (meetingTime) {
      const channel = clientSupabase
        .channel(chatRoomId)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'chatting_room', filter: `chatting_room_id=eq.${chatRoomId}` },
          (payload) => {
            updateMeetingTime(payload.new.chatting_room_id);
          }
        )
        .subscribe();

      return () => {
        clientSupabase.removeChannel(channel);
      };
    }
  }, [meetingTime, updateMeetingTime]);

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="transition-max-h ease-in-out duration-1000 ">
      <div className="max-h-screen overflow-y-auto w-full pt-8 pr-6">
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
