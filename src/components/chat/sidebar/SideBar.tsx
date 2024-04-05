'use client';

import React, { useState } from 'react';
import Map from '(@/components/chat/sidebar/Map)';

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <button onClick={toggleSidebar}>{isSidebarOpen ? 'close' : 'open'}</button>
      <Map />
    </div>
  );
};

export default SideBar;
