'use client';

import React from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { sideBarStore } from '@/store/sideBarStore';

const SideBarButton: React.FC = () => {
  const { isSidebarOpen, setIsSidebarOpen } = sideBarStore((state) => state);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log('사이드바 상태', isSidebarOpen);
  };

  return (
    <div className="h-20 cursor-pointer shadow-xl flex justify-center items-center z-100" onClick={toggleSidebar}>
      {isSidebarOpen ? <IoIosArrowForward size={25} color="#A1A1AA" /> : <IoIosArrowBack size={25} color="#A1A1AA" />}
    </div>
  );
};

export default SideBarButton;
