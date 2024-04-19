import React from 'react';
import { IoMdHeart } from 'react-icons/io';

const UseInformation = () => {
  return (
    <div className="flex flex-col mb-12 gap-8 mx-auto max-w-[1000px] w-full">
      <p className="text-[26px] font-bold">이용안내</p>
      {/* Section 01 */}
      <div className="flex flex-row justify-between ">
        <div className="flex justify-center items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-mainColor text-3xl text-center">01</p>
            <div className="border rounded-full bg-purpleThird w-40 h-40 flex justify-center items-center">
              <img src="/gotoLobby.svg" alt="GotoLobby" />
            </div>
            <div className="text-center mb-6">
              <p>로비 들어가기</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 px-20">
            <IoMdHeart size={24} color="#F31260" />
            <IoMdHeart size={24} color="#F31260" />
            <IoMdHeart size={24} color="#F31260" />
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-mainColor text-3xl text-center">02</p>
            <div className="border rounded-full bg-purpleThird w-40 h-40 flex justify-center items-center">
              <img src="/roomKey.svg" alt="roomKey" />
            </div>
            <div className="text-center">
              <p>미팅방 만들기</p>
              <p>or 들어가기</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 px-20">
            <IoMdHeart size={24} color="#F31260" />
            <IoMdHeart size={24} color="#F31260" />
            <IoMdHeart size={24} color="#F31260" />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col gap-4">
            <p className="text-mainColor text-3xl text-center">03</p>
            <div className="border rounded-full bg-purpleThird w-40 h-40 flex justify-center items-center">
              <img src="/gotoChat.svg" alt="gotoChat" />
            </div>
            <div className="text-center">
              <p>인원수가 다 채워지면</p>
              <p>방장이 채팅창으로</p>
              <p>넘기기</p>
            </div>
          </div>
        </div>
      </div>
      {/* Section 02 */}
      <div className="flex flex-row justify-between">
        <div className="flex justify-center items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-mainColor text-3xl text-center">01</p>
            <div className="border rounded-full bg-purpleThird w-40 h-40 flex justify-center items-center">
              <img src="/chatTime.svg" alt="chatTime" />
            </div>
            <div className="text-center">
              <p>채팅창에서</p>
              <p>날짜와 장소 정하기</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 px-20">
            <IoMdHeart size={24} color="#F31260" />
            <IoMdHeart size={24} color="#F31260" />
            <IoMdHeart size={24} color="#F31260" />
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-mainColor text-3xl text-center">02</p>
            <div className="border rounded-full bg-purpleThird w-40 h-40 flex justify-center items-center">
              <img src="/gotoMeeting.svg" alt="gotoMeeting" />
            </div>
            <div className="text-center mb-6">
              <p>미팅 진행</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 px-20">
            <IoMdHeart size={24} color="#F31260" />
            <IoMdHeart size={24} color="#F31260" />
            <IoMdHeart size={24} color="#F31260" />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col gap-4">
            <p className="text-mainColor text-3xl text-center">03</p>
            <div className="border rounded-full bg-purpleThird w-40 h-40 flex justify-center items-center">
              <img src="/kakaoTalk.svg" alt="kakaoTalk" />
            </div>
            <div className="text-center">
              <p>미팅 후 마이페이지에서</p>
              <p>마음에 드는 이성</p>
              <p>카톡ID 요청</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseInformation;
