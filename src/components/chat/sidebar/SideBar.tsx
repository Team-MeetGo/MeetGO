'use client';

import React, { useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DatePicker';
import { User } from '@supabase/supabase-js';

interface SideBarProps {
  userId: string | null | undefined;
  leaderId: string | null | undefined;
}

const SideBar: React.FC<SideBarProps> = ({ userId, leaderId }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <button onClick={toggleSidebar}>사이드바</button>
      {isSidebarOpen && (
        <div>
          <DatePicker />
          <div>미팅 장소 : {selectedLocation}</div>
          <Map setSelectedLocation={setSelectedLocation} userId={userId} leaderId={leaderId} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
