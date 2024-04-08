'use client';

import React, { useEffect, useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DatePicker';
import { clientSupabase } from '(@/utils/supabase/client)';
import { sideBarStore } from '(@/store/sideBarStore)';
import { useChatDataQuery, useRoomDataQuery } from '(@/hooks/useQueries/useChattingQuery)';

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
    }
    setIsTimeSelected(!isTimeSelected);

    setFinalDateTime(selectedMeetingTime);

    if (!isTimeSelected) {
      // 장소 선택 안되었을 때
      const { error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_time: selectedMeetingTime })
        .eq('chatting_room_id', chatRoomId);
    } else {
      setSelectedMeetingTime('');
      setFinalDateTime('');
      const { error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_time: null })
        .eq('chatting_room_id', chatRoomId);
    }
  };

  return (
    <div className="absolute">
      <button onClick={toggleSidebar}>사이드바</button>
      {isSidebarOpen && (
        <div>
          <div>
            {/* {userId === leaderId && (
              <>
                미팅 날짜/시간:
                <input
                  type="text"
                  className="border"
                  value={selectedMeetingTime}
                  onChange={(e) => setSelectedMeetingTime(e.target.value)}
                />
                <button onClick={handleSelectedTime}>{isTimeSelected ? '취소' : '선택'}</button>
              </>
            )} */}

            <>
              미팅 날짜/시간:
              <input
                type="text"
                className="border"
                value={selectedMeetingTime ?? ''}
                onChange={(e) => setSelectedMeetingTime(e.target.value)}
              />
              <button onClick={handleSelectedTime}>{isTimeSelected ? '취소' : '선택'}</button>
            </>

            <p>최종 날짜 : {finalDateTime}</p>
          </div>
          <DatePicker />
          <Map userId={userId} chatRoomId={chatRoomId} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
