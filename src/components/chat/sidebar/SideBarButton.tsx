'use client';

import React from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { sideBarStore } from '@/store/sideBarStore';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

const SideBarButton = () => {
  const { isSidebarOpen, setIsSidebarOpen } = sideBarStore((state) => state);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div
        className="absolute z-50 h-20 max-sm:hidden cursor-pointer shadow-xl flex justify-center items-center rounded-r-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <IoIosArrowForward size={28} color="#A1A1AA" /> : <IoIosArrowBack size={28} color="#A1A1AA" />}
      </div>

      <div
        className="absolute z-50 lg:hidden max-sm:h-8 max-sm:bg-[#F2EAFA] cursor-pointer shadow-xl flex justify-center items-center rounded-r-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <IoIosArrowBack size={28} color="#A1A1AA" /> : <IoIosArrowForward size={28} color="#A1A1AA" />}
      </div>
    </>
  );
};

export default SideBarButton;
