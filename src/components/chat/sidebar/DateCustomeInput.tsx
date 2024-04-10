import React from 'react';
import { MdOutlineDateRange } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa6';

interface DateCustomeInputProps {
  onClick: () => void;
}

const DateCustomeInput: React.FC<DateCustomeInputProps> = ({ onClick }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="border w-full h-[60px] flex items-center border-mainColor rounded-lg">
        <MdOutlineDateRange size={25} color="#8F5DF4" className="ml-3.5" />
        <h1 className="flex-1 px-4 font-semibold text-2xl"> Date/Time Picker</h1>
        <button onClick={onClick}>
          <FaChevronDown className="mr-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DateCustomeInput;
