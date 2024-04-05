'use client';

import React, { useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DatePicker';
import { clientSupabase } from '(@/utils/supabase/client)';

interface SideBarProps {
  userId: string | null | undefined;
  leaderId: string | null | undefined;
  chatRoomId: string | null | undefined;
}

const SideBar: React.FC<SideBarProps> = ({ userId, leaderId, chatRoomId }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedDateTime, setSelectedDateTime] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [finalDateTime, setFinalDateTime] = useState<string>('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectedTime = async () => {
    setFinalDateTime(selectedDateTime);
    if (chatRoomId) {
      const { data: insertedTime, error: insertError } = await clientSupabase
        .from('chatting_room')
        .update({ meeting_time: selectedDateTime })
        .eq('chatting_room_id', chatRoomId);
      console.log('시간', selectedDateTime);
    }
  };
    console.log('시간', selectedDateTime);
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
            <button onClick={handleSelectedTime}>날짜 선택</button>
            <p>선택한 날짜 시간이 보여진다. {finalDateTime}</p>
          </div>
          <DatePicker />
          <p>미팅 장소 : {selectedLocation}</p>
          <Map setSelectedLocation={setSelectedLocation} userId={userId} leaderId={leaderId} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
