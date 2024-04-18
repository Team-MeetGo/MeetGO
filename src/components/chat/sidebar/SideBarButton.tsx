'use client';

import React, { useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import SideBar from './SideBar';
import { SideBarButtonProps } from '@/types/sideBarTypes';

const SideBarButton: React.FC<SideBarButtonProps> = ({ chatRoomId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex flex-row ${isSidebarOpen ? 'ml-auto' : 'ml-0'} `}>
      {isSidebarOpen && <SideBar chatRoomId={chatRoomId} isSidebarOpen={isSidebarOpen} />}
      <div className="h-20 cursor-pointer shadow-xl flex justify-center items-center " onClick={toggleSidebar}>
        {isSidebarOpen ? <IoIosArrowForward size={25} color="#A1A1AA" /> : <IoIosArrowBack size={25} color="#A1A1AA" />}
      </div>
    </div>
  );
};

export default SideBarButton;
