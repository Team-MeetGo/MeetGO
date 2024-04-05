'use client';

import React, { useEffect, useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DatePicker';
import { clientSupabase } from '(@/utils/supabase/client)';
import { useSidebarStore } from '(@/store/sideBarStore)';

interface SideBarProps {
  userId: string | null | undefined;
  leaderId: string | null | undefined;
  chatRoomId: string | null;
}

const SideBar: React.FC<SideBarProps> = ({ userId, leaderId, chatRoomId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const {
    selectedMeetingTime,
    SetSelectedMeetingTime,
    setFinalDateTime,
    setIsTimeSelected,
    finalDateTime,
    isTimeSelected
  } = useSidebarStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!chatRoomId) {
        return;
      }
      const { data: chatData } = await clientSupabase
        .from('chatting_room')
        .select('meeting_time')
        .eq('chatting_room_id', chatRoomId)
        .single();
      const meetingTime = chatData?.meeting_time;

      setIsTimeSelected(!!meetingTime);

      SetSelectedMeetingTime(meetingTime || '');
      setFinalDateTime(meetingTime || '');
    };
    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectedTime = async () => {
    if (!chatRoomId) {
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
    } else {
      SetSelectedMeetingTime('');
      setFinalDateTime('');
      const { error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_time: null })
        .eq('chatting_room_id', chatRoomId);
    }
  };

  return (
    <div>
      <button onClick={toggleSidebar}>사이드바</button>
      {isSidebarOpen && (
        <div>
          <div>
            미팅 날짜/시간:
            <input
              type="text"
              className="border"
              value={selectedMeetingTime}
              onChange={(e) => SetSelectedMeetingTime(e.target.value)}
            />
            <button onClick={handleSelectedTime}>{isTimeSelected ? '취소' : '선택'}</button>
            <p>최종 날짜 : {finalDateTime}</p>
          </div>
          <DatePicker />
          <Map userId={userId} leaderId={leaderId} chatRoomId={chatRoomId} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
