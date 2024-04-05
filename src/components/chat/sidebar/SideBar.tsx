'use client';

import React, { useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';
import DatePicker from './DatePicker';

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectLocation = (barName: string) => {
    setSelectedLocation(barName);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <button onClick={toggleSidebar}>{isSidebarOpen ? 'close' : 'open'}</button>
      <DatePicker />
      <div>미팅 장소 : {selectedLocation}</div>
      <Map setSelectedLocation={setSelectedLocation} />
    </div>
  );
};

export default SideBar;
