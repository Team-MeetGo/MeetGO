'use client';

import React, { useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DatePicker';
import { serverSupabase } from '(@/utils/supabase/server)';

const SideBar = () => {
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
          <Map setSelectedLocation={setSelectedLocation} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
