import React from 'react';
import Link from 'next/link';

const MainMiddleBanner = () => {
  return (
    <div className="w-full h-20 bg-mainColor flex justify-center items-center">
      {/* <div className="flex items-center"> */}
      <p className="text-[30px] text-white mr-[60px]">현재 많은 인연들이 기다리고 있어요!</p>
      {/* <Link
        className="bg-transparant border-1 rounded-xl border-white max-w-[267px] h-[60px] text-[18px] text-white pt-[13px] pb-[13px] pl-[60px] pr-[60px] hover:bg-white hover:text-mainColor font-bold"
        href="/meetingRoom"
      >
        로비로 바로가기
      </Link> */}
      {/* </div> */}
    </div>
  );
};

export default MainMiddleBanner;
