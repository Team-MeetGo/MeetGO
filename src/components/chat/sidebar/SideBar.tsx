'use client';

import React, { useEffect, useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DateTimePicker';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useChatDataQuery, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Card, CardBody, Select, SelectItem } from '@nextui-org/react';
import DateTimePicker from './DateTimePicker';

interface SideBarProps {
  userId: string | null | undefined;
  chatRoomId: string;
}

const SideBar: React.FC<SideBarProps> = ({ userId, chatRoomId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isTimeSelected, setIsTimeSelected] = useState<boolean>(false);
  const [selectedMeetingTime, setSelectedMeetingTime] = useState<string>();
  const [finalDateTime, setFinalDateTime] = useState<string>();

  const room = useRoomDataQuery(chatRoomId);
  const leaderId = room?.roomData.leader_id;

  // 채팅방 정보 가져오기
  const chat = useChatDataQuery(chatRoomId);
  const meetingTime = chat?.[0]?.meeting_time;

  useEffect(() => {
    setSelectedMeetingTime(meetingTime || '');
    setIsTimeSelected(!!meetingTime);
    setFinalDateTime(meetingTime || '');
  }, [meetingTime]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectedTime = async () => {
    if (!chatRoomId) {
      return;
    }
    if (selectedMeetingTime === '') {
      alert('시간을 선택해주세요.');
      return;
    }
    setIsTimeSelected(!isTimeSelected);

    setFinalDateTime(selectedMeetingTime);

    if (!isTimeSelected) {
      // 장소 선택 안되었을 때
      const { error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_time: selectedMeetingTime })
        .eq('chatting_room_id', chatRoomId);
      if (error) {
        console.log('서버에 미팅 시간 추가 에러', error);
      }
    } else {
      setSelectedMeetingTime('');
      setFinalDateTime('');
      const { error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_time: null })
        .eq('chatting_room_id', chatRoomId);
      if (error) {
        console.log('서버에 미팅 시간 삭제 에러', error);
      }
    }
  };

  return (
    <div className=" w-[377px] flex flex-col ml-8 z-0 ">
      <div className={`flex ${isSidebarOpen ? 'justify-end' : 'justify-start'}`}>
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
            미팅 날짜/시간:
            <input
              type="text"
              className="border"
              value={selectedMeetingTime ?? ''}
              onChange={(e) => setSelectedMeetingTime(e.target.value)}
            />
            <button onClick={handleSelectedTime}>{isTimeSelected ? '취소' : '선택'}</button>
            <Map userId={userId} chatRoomId={chatRoomId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
