'use client';

import React, { useEffect, useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DatePicker';
import { clientSupabase } from '(@/utils/supabase/client)';
import { chatStore } from '(@/store/chatStore)';
import { sideBarStore } from '(@/store/sideBarStore)';

interface SideBarProps {
  userId: string | null | undefined;
}

const SideBar: React.FC<SideBarProps> = ({ userId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const {
    selectedMeetingTime,
    isTimeSelected,
    finalDateTime,
    setSelectedMeetingTime,
    setIsTimeSelected,
    setFinalDateTime
  } = sideBarStore((state) => state);

  const { roomId, chatRoomId, roomData } = chatStore((state) => state);

  const thisRoomId = roomData?.find((room) => room.room_id === roomId);
  const leaderId = thisRoomId?.leader_id;

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
          <Map userId={userId} leaderId={leaderId} chatRoomId={chatRoomId} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
