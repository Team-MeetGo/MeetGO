import React from 'react';
import { MdDateRange } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';

const DateCustomeInput = ({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full w-full">
        <div className="border w-full h-14 flex items-center border-gray2 rounded-lg">
          <MdDateRange size={25} color="#8F5DF4" className="ml-3.5" />
          <h1 className="flex-1 px-4 font-semibold text-xl"> Date / Time</h1>
          <button onClick={onClick}>
            <IoIosArrowDown size={24} className="mr-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default DateCustomeInput;
