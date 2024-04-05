'use client';

import React, { useEffect, useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DatePicker';
import { clientSupabase } from '(@/utils/supabase/client)';

interface SideBarProps {
  userId: string | null | undefined;
  leaderId: string | null | undefined;
  chatRoomId: string | null;
}

const SideBar: React.FC<SideBarProps> = ({ userId, leaderId, chatRoomId }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedDateTime, setSelectedDateTime] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [finalDateTime, setFinalDateTime] = useState<string>('');
  const [isTimePicked, setIsTimePicked] = useState<boolean>(false);

  useEffect(() => {
    // 서버에서 불러와서
    const fetchData = async () => {
      if (!chatRoomId) {
        return;
      }
      const { data: chatData } = await clientSupabase
        .from('chatting_room')
        .select('meeting_time, meeting_location')
        .eq('chatting_room_id', chatRoomId)
        .single();
      const meetingTime = chatData?.meeting_time;
      const meetingLocation = chatData?.meeting_location;
      setSelectedLocation(meetingLocation || '');
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
    setIsTimePicked(!isTimePicked);
    setFinalDateTime(selectedDateTime);

    if (!isTimePicked) {
      // 장소 선택 안되었을 때
      const { error } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_time: selectedDateTime })
        .eq('chatting_room_id', chatRoomId);
      console.log(chatRoomId);
    } else {
      setSelectedDateTime('');
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
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
            />
            <button onClick={handleSelectedTime}>{isTimePicked ? '취소' : '선택'}</button>
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
