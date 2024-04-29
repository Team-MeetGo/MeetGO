'use client';

import React from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { sideBarStore } from '@/store/sideBarStore';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { CiMenuKebab } from 'react-icons/ci';

const SideBarButton = () => {
  const { isSidebarOpen, setIsSidebarOpen } = sideBarStore((state) => state);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div
        className="absolute z-10 h-20 cursor-pointer shadow-xl flex justify-center items-center rounded-r-lg lg:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <IoIosArrowForward size={28} color="#A1A1AA" /> : <IoIosArrowBack size={28} color="#A1A1AA" />}
      </div>
    </>
  );
};

export default SideBarButton;
